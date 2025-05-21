import { u8 } from "../mod.ts";
import { ArrayType } from "./array.ts";
import { assertEquals, assertThrows } from "../../test_deps.ts";

Deno.test({
  name: "Array",
  fn: async (t) => {
    const ab = new ArrayBuffer(2);
    const dt = new DataView(ab);
    const type = new ArrayType(u8, 2);

    await t.step("estimated size", () => {
      assertEquals(type.maxSize, 2);
    });

    await t.step("Read", () => {
      dt.setUint16(0, 0xFFFF);
      const result = type.read(dt);
      assertEquals(result, [255, 255]);
    });

    await t.step("Write", () => {
      type.write([127, 0], dt);
      assertEquals(dt.getUint16(0), 0x7F00);
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 2 });
      }, RangeError);
    });

    await t.step("Inequal length", () => {
      assertThrows(() => {
        type.writePacked([1, 2, 3, 4], dt);
      }, TypeError);

      assertThrows(() => {
        type.write([1, 2, 3, 4], dt);
      }, TypeError);
    });
  },
});
