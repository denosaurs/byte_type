import { assertEquals, assertThrows } from "../test_deps.ts";
import { Offset, Reverse, Skip, Struct, u32 } from "./mod.ts";

Deno.test({
  name: "Offset (meta)",
  fn: async (t) => {
    const ab = new ArrayBuffer(8);
    const dt = new DataView(ab);
    const type = new Struct({
      junk: new Offset(3),
      version: u32,
    });

    await t.step("Read", () => {
      dt.setUint32(4, 32, true);
      const result = type.read(dt);
      assertEquals(result, { junk: null, version: 32 });
    });

    await t.step("Read Packed", () => {
      dt.setUint32(3, 32, true);
      const result = type.readPacked(dt);
      assertEquals(result, { junk: null, version: 32 });
    });

    await t.step("Write", () => {
      // Make sure value doesn't get written over.
      dt.setUint32(0, 12, true);
      dt.setUint32(4, 0, true);
      type.write({ junk: null, version: 1 }, dt);

      assertEquals(dt.getUint32(0, true), 12);
      assertEquals(dt.getUint32(4, true), 1);
    });

    await t.step("Write Packed", () => {
      // Make sure value doesn't get written over.
      dt.setUint16(0, 12, true);
      dt.setUint8(2, 12);
      dt.setUint32(3, 0, true);
      type.writePacked({ junk: null, version: 1 }, dt);

      assertEquals(dt.getUint16(0, true), 12);
      assertEquals(dt.getUint8(2), 12);
      assertEquals(dt.getUint32(3, true), 1);
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        new Offset(3).read(dt, { byteOffset: 9 });
      }, RangeError);
    });
  },
});

Deno.test({
  name: "Skip (meta)",
  fn: async (t) => {
    const ab = new ArrayBuffer(8);
    const dt = new DataView(ab);
    const type = new Struct({
      junk: new Skip(3),
      version: u32,
    });

    await t.step("Read", () => {
      dt.setUint32(4, 32, true);
      const result = type.read(dt);
      assertEquals(result, { junk: null, version: 32 });
    });

    await t.step("Read Packed", () => {
      dt.setUint32(3, 32, true);
      const result = type.readPacked(dt);
      assertEquals(result, { junk: null, version: 32 });
    });

    await t.step("Write", () => {
      // Make sure value doesn't get written over.
      dt.setUint32(0, 12, true);
      dt.setUint32(4, 0, true);
      type.write({ junk: null, version: 1 }, dt);

      assertEquals(dt.getUint32(0, true), 12);
      assertEquals(dt.getUint32(4, true), 1);
    });

    await t.step("Write Packed", () => {
      // Make sure value doesn't get written over.
      dt.setUint16(0, 12, true);
      dt.setUint8(2, 12);
      dt.setUint32(3, 0, true);
      type.writePacked({ junk: null, version: 1 }, dt);

      assertEquals(dt.getUint16(0, true), 12);
      assertEquals(dt.getUint8(2), 12);
      assertEquals(dt.getUint32(3, true), 1);
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        new Skip(3).read(dt, { byteOffset: 9 });
      }, RangeError);
    });
  },
});

Deno.test({
  name: "Reverse (meta)",
  fn: async (t) => {
    const ab = new ArrayBuffer(8);
    const dt = new DataView(ab);
    const type = new Struct({
      $meta: new Reverse(4),
      version: u32,
    });

    await t.step("Read", () => {
      dt.setUint32(0, 32, true);
      const result = type.read(dt, { byteOffset: 4 });
      assertEquals(result, {
        version: 32,
        $meta: null,
      });
    });

    await t.step("Read Packed", () => {
      dt.setUint32(0, 32, true);
      const result = type.readPacked(dt, { byteOffset: 4 });
      assertEquals(result, {
        version: 32,
        $meta: null,
      });
    });

    await t.step("Write", () => {
      dt.setUint32(0, 0, true);
      type.write({ $meta: null, version: 2 }, dt, { byteOffset: 4 });

      assertEquals(dt.getUint32(0, true), 2);
      assertEquals(dt.getUint32(4, true), 0);
    });

    await t.step("Write Packed", () => {
      dt.setUint32(0, 0, true);
      type.writePacked({ $meta: null, version: 2 }, dt, { byteOffset: 4 });

      assertEquals(dt.getUint32(0, true), 2);
      assertEquals(dt.getUint32(4, true), 0);
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        new Reverse(10).read(dt);
      });
    });
  },
});
