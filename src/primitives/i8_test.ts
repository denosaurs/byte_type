import { i8 } from "./i8.ts";
import { assertEquals, assertThrows } from "../../test_deps.ts";

Deno.test({
  name: "I8",
  fn: async (t) => {
    const ab = new ArrayBuffer(8);
    const dt = new DataView(ab);
    const type = i8;

    await t.step("Read", () => {
      dt.setInt8(0, 12);
      const result = type.read(dt);
      assertEquals(result, 12);
    });

    dt.setBigUint64(0, 0n);

    await t.step("Write", () => {
      type.write(10, dt);
      assertEquals(dt.getInt8(0), 10);
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 9 });
      }, RangeError);
    });
  },
});
