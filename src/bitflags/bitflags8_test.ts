import { BitFlags8 } from "./bitflags8.ts";
import { assertEquals, assertThrows } from "../../test_deps.ts";

Deno.test({
  name: "BitFlags8",
  fn: async (t) => {
    const ab = new ArrayBuffer(1);
    const dt = new DataView(ab);
    const type = new BitFlags8({
      one: 1,
      two: 2,
    });

    await t.step("estimated size", () => {
      assertEquals(type.maxSize, 1);
    });

    await t.step("Read", () => {
      dt.setUint8(0, 0b01);
      const result = type.read(dt);
      assertEquals(result, { one: true, two: false });
    });

    await t.step("Write", () => {
      type.write({ one: false, two: true }, dt);
      assertEquals(dt.getUint8(0), 0b10);
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 2 });
      }, RangeError);
    });
  },
});
