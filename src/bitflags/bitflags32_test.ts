import { BitFlags32 } from "./bitflags32.ts";
import { assertEquals, assertThrows } from "../../test_deps.ts";

Deno.test({
  name: "BitFlags32",
  fn: async (t) => {
    const ab = new ArrayBuffer(4);
    const dt = new DataView(ab);
    const type = new BitFlags32({
      one: 1,
      two: 2,
    });

    await t.step("estimated size", () => {
      assertEquals(type.maxSize, 4);
    });

    await t.step("Read", () => {
      dt.setUint8(3, 0b01);
      const result = type.read(dt);
      assertEquals(result, { one: true, two: false });
    });

    await t.step("Write", () => {
      type.write({ one: false, two: true }, dt);
      assertEquals(dt.getUint8(3), 0b10);
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 5 });
      }, RangeError);
    });
  },
});
