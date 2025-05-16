import { cstring, u32le, u8 } from "../mod.ts";
import { assertEquals, assertThrows } from "../../test_deps.ts";
import { Union } from "./union.ts";

Deno.test({
  name: "Union",
  fn: async (t) => {
    const ab = new ArrayBuffer(8);
    const dt = new DataView(ab);
    const type = new Union({
      0: u32le,
      1: u8,
      2: u8,
    }, (a) => a === 32 ? 0 : 1);

    await t.step("estimate size", () => {
      const type = new Union({
        0: u32le,
        1: u8,
        2: u8,
      }, (a) => a === 32 ? 0 : 1);
      assertEquals(type.maxSize, 4);

      const unknownSizedType = new Union({
        0: cstring,
      }, () => 0);

      assertEquals(unknownSizedType.maxSize, null);
    });

    await t.step("Read", () => {
      dt.setUint8(0, 1);
      dt.setUint8(1, 11);
      dt.setUint8(2, 22);
      dt.setUint8(4, 33);
      const result = type.read(dt);
      assertEquals(result, 1);
    });

    await t.step("Read Packed", () => {
      dt.setUint8(0, 1);
      dt.setUint8(1, 11);
      dt.setUint8(2, 22);
      dt.setUint8(4, 33);
      const result = type.readPacked(dt);
      assertEquals(result, 1);
    });

    dt.setBigUint64(0, 0n);

    await t.step("Write", () => {
      type.write(32, dt);
      assertEquals(new Uint32Array(ab), Uint32Array.of(32, 0));
    });

    dt.setBigUint64(0, 0n);

    await t.step("Write Packed", () => {
      type.writePacked(32, dt);
      assertEquals(
        new Uint8Array(ab).subarray(0, 5),
        Uint8Array.of(32, 0, 0, 0, 0),
      );
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 9 });
      }, RangeError);
    });
  },
});
