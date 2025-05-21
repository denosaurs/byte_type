import { isLittleEndian } from "../util.ts";
import { Uint16ArrayType } from "./typed_array.ts";
import { assertEquals, assertThrows } from "../../test_deps.ts";

Deno.test({
  name: "TypedArray",
  fn: async (t) => {
    const ab = new ArrayBuffer(2);
    const dt = new DataView(ab);
    const type = new Uint16ArrayType(1);

    await t.step("estimated size", () => {
      assertEquals(type.maxSize, 2);
    });

    await t.step("Read", () => {
      dt.setUint16(0, 0xFFFF);
      const result = type.read(dt);
      assertEquals(result, Uint16Array.of(0xFFFF));
    });

    await t.step("Write", () => {
      type.write(Uint16Array.of(0x7F00), dt);
      assertEquals(dt.getUint16(0, isLittleEndian), 0x7F00);
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 2 });
      }, RangeError);
    });
  },
});
