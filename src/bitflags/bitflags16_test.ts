import { BitFlags16 } from "./bitflags16.ts";
import { assertEquals, assertThrows } from "../../test_deps.ts";

Deno.test({
  name: "BitFlags16",
  fn: async (t) => {
    const ab = new ArrayBuffer(2);
    const dt = new DataView(ab);
    const type = new BitFlags16({
      one: 1,
      two: 2,
    });

    await t.step("estimated size", () => {
      assertEquals(type.maxSize, 2);
    });

    await t.step("Read", () => {
      dt.setUint8(1, 0b01);
      const result = type.read(dt);
      assertEquals(result, { one: true, two: false });
    });

    await t.step("Write", () => {
      type.write({ one: false, two: true }, dt);
      assertEquals(dt.getUint8(1), 0b10);
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 3 });
      }, RangeError);
    });
  },
});
