import { BitFlags64 } from "./bitflags64.ts";
import { assertEquals, assertThrows } from "../../test_deps.ts";

Deno.test({
  name: "BitFlags64",
  fn: async (t) => {
    const ab = new ArrayBuffer(8);
    const dt = new DataView(ab);
    const type = new BitFlags64({
      one: 1n,
      two: 2n,
    });

    await t.step("estimated size", () => {
      assertEquals(type.maxSize, 8);
    });

    await t.step("Read", () => {
      dt.setUint8(7, 0b01);
      const result = type.read(dt);
      assertEquals(result, { one: true, two: false });
    });

    await t.step("Write", () => {
      type.write({ one: false, two: true }, dt);
      assertEquals(dt.getUint8(7), 0b10);
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 9 });
      }, RangeError);
    });
  },
});
