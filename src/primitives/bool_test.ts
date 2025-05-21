import { bool } from "./bool.ts";
import { assertEquals, assertThrows } from "../../test_deps.ts";

Deno.test({
  name: "Boolean",
  fn: async (t) => {
    const ab = new ArrayBuffer(8);
    const dt = new DataView(ab);
    const type = bool;

    await t.step("estimate size", () => {
      assertEquals(type.maxSize, 1);
    });
    await t.step("Read", () => {
      dt.setUint8(0, 1);
      const result = type.read(dt);
      assertEquals(result, true);
    });

    dt.setBigUint64(0, 0n);

    await t.step("Write", () => {
      type.write(false, dt);
      assertEquals(dt.getUint8(0), 0);
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 9 });
      }, RangeError);
    });
  },
});
