import { f64le } from "./f64.ts";
import { assertEquals, assertThrows } from "../../test_deps.ts";

Deno.test({
  name: "F64",
  fn: async (t) => {
    const ab = new ArrayBuffer(8);
    const dt = new DataView(ab);
    const type = f64le;

    await t.step("Read", () => {
      dt.setFloat64(0, 12, true);
      const result = type.read(dt);
      assertEquals(result, 12);
    });

    dt.setBigUint64(0, 0n);

    await t.step("Write", () => {
      type.write(10, dt);
      assertEquals(dt.getFloat64(0, true), 10);
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 9 });
      }, RangeError);
    });
  },
});
