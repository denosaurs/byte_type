import { u32le, u8 } from "../mod.ts";
import { assertEquals, assertThrows } from "../../test_deps.ts";
import { SizedStruct } from "./mod.ts";

Deno.test({
  name: "Sized Struct JIT",
  fn: async (t) => {
    const ab = new ArrayBuffer(8);
    const dt = new DataView(ab);
    const type = new SizedStruct({ byte: u8, word: u32le });

    await t.step("estimated size", () => {
      assertEquals(type.maxSize, 8);
    });

    await t.step("Read", () => {
      dt.setUint8(0, 127);
      dt.setUint32(4, 255, true);
      const result = type.read(dt);
      assertEquals(result, { byte: 127, word: 255 });
    });

    await t.step("Read Packed", () => {
      dt.setUint8(0, 127);
      dt.setUint32(1, 255, true);
      const result = type.readPacked(dt);
      assertEquals(result, { byte: 127, word: 255 });
    });

    dt.setBigUint64(0, 0n);

    await t.step("Write", () => {
      type.write({ byte: 255, word: 127 }, dt);
      assertEquals(dt.getUint32(0, true), 255);
      assertEquals(dt.getUint32(4, true), 127);
    });

    await t.step("Write Packed", () => {
      type.writePacked({ byte: 255, word: 127 }, dt);
      assertEquals(dt.getUint8(0), 255);
      assertEquals(dt.getUint32(1, true), 127);
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 9 });
      }, RangeError);
    });
  },
});

Deno.test({
  name: "Sized Struct NON-JIT",
  fn: async (t) => {
    const ab = new ArrayBuffer(8);
    const dt = new DataView(ab);
    const type = new SizedStruct({ byte: u8, word: u32le }, false);

    await t.step("Read", () => {
      dt.setUint8(0, 127);
      dt.setUint32(4, 255, true);
      const result = type.read(dt);
      assertEquals(result, { byte: 127, word: 255 });
    });

    await t.step("Read Packed", () => {
      dt.setUint8(0, 127);
      dt.setUint32(1, 255, true);
      const result = type.readPacked(dt);
      assertEquals(result, { byte: 127, word: 255 });
    });

    dt.setBigUint64(0, 0n);

    await t.step("Write", () => {
      type.write({ byte: 255, word: 127 }, dt);
      assertEquals(dt.getUint32(0, true), 255);
      assertEquals(dt.getUint32(4, true), 127);
    });

    await t.step("Write Packed", () => {
      type.writePacked({ byte: 255, word: 127 }, dt);
      assertEquals(dt.getUint8(0), 255);
      assertEquals(dt.getUint32(1, true), 127);
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 9 });
      }, RangeError);
    });
  },
});
