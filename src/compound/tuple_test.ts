import { Tuple } from "./tuple.ts";
import { u32le, u8 } from "../mod.ts";
import { assertEquals, assertThrows } from "../../test_deps.ts";

Deno.test({
  name: "Tuple",
  fn: async (t) => {
    const ab = new ArrayBuffer(8);
    const dt = new DataView(ab);
    const type = new Tuple([u8, u32le]);

    await t.step("Read", () => {
      dt.setUint32(0, 127, true);
      dt.setUint32(4, 255, true);
      const result = type.read(dt);
      assertEquals(result, [127, 255]);
    });

    await t.step("Read Packed", () => {
      dt.setUint32(0, 255, true);
      dt.setUint32(1, 127, true);
      const result = type.readPacked(dt);
      assertEquals(result, [255, 127]);
    });

    dt.setBigUint64(0, 0n);

    await t.step("Write", () => {
      type.write([127, 255], dt);
      assertEquals(dt.getUint32(0, true), 127);
      assertEquals(dt.getUint32(4, true), 255);
    });

    dt.setBigUint64(0, 0n);

    await t.step("Write Packed", () => {
      type.write([255, 127], dt);
      assertEquals(dt.getUint32(0, true), 255);
      assertEquals(dt.getUint32(4, true), 127);
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 9 });
      }, RangeError);
    });
  },
});
