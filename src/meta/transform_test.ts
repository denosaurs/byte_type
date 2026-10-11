import {
  cstring,
  SizedStruct,
  SizedType,
  Struct,
  u16,
  u32,
  u8,
} from "../mod.ts";
import { map } from "./transform.ts";
import { assertEquals } from "../../test_deps.ts";

Deno.test({
  name: "Map",
  fn: async (t) => {
    const ab = new ArrayBuffer(4);
    const dt = new DataView(ab);
    const type = map(u8, (v) => v / 2, (v) => v * 2);

    await t.step("estimated size", () => {
      assertEquals((type as SizedType<number>).byteSize, u8.byteSize);
      assertEquals(type.maxSize, u8.maxSize);
      assertEquals(type.byteAlignment, u8.byteAlignment);
    });

    await t.step("Read", () => {
      dt.setUint8(0, 8);
      assertEquals(type.read(dt), 4);
    });

    await t.step("Write", () => {
      type.write(3, dt);
      assertEquals(dt.getUint8(0), 6);
    });

    await t.step("Advances the offset by the inner width", () => {
      const options = { byteOffset: 0 };
      type.readPacked(dt, options);
      assertEquals(options.byteOffset, u8.byteSize);
    });

    await t.step("A sized codec stays sized", () => {
      assertEquals(type instanceof SizedType, true);
    });

    await t.step("An unsized codec stays unsized", () => {
      const upper = map(
        cstring,
        (v) => v.toUpperCase(),
        (v) => v.toLowerCase(),
      );
      assertEquals(upper instanceof SizedType, false);

      const text = new DataView(new TextEncoder().encode("abc\0").buffer);
      assertEquals(upper.read(text), "ABC");
    });

    await t.step("Keeps the field padding of a composite type", () => {
      const inner = new SizedStruct({ a: u8, b: u32 });
      const buffer = new DataView(new ArrayBuffer(16));
      inner.write({ a: 1, b: 0xAABBCCDD }, buffer);

      const wrapped = map(inner, (v) => v, (v) => v);
      const read = { byteOffset: 0 };
      assertEquals(wrapped.read(buffer, read), { a: 1, b: 0xAABBCCDD });
      assertEquals(read.byteOffset, 8);

      const out = new DataView(new ArrayBuffer(16));
      const write = { byteOffset: 0 };
      wrapped.write({ a: 1, b: 0xAABBCCDD }, out, write);
      assertEquals(write.byteOffset, 8);
      assertEquals(inner.read(out), { a: 1, b: 0xAABBCCDD });
    });

    await t.step("Composes into a Struct", () => {
      const struct = new Struct({ half: type, raw: u8 });
      dt.setUint16(0, 0x0A07);
      assertEquals(struct.read(dt), { half: 5, raw: 7 });
    });

    await t.step("Composes into a SizedStruct", () => {
      const struct = new SizedStruct({ half: type, raw: u16 });
      assertEquals(struct.byteSize, u8.byteSize + u16.byteSize);

      struct.write({ half: 2, raw: 513 }, dt);
      assertEquals(struct.read(dt), { half: 2, raw: 513 });
    });
  },
});
