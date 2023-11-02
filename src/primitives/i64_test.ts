import { i64le } from "./i64.ts";
import { assertEquals, assertThrows } from "../../test_deps.ts";

Deno.test({
  name: "I64",
  fn: async (t) => {
    const ab = new ArrayBuffer(8);
    const dt = new DataView(ab);
    const type = i64le;

    await t.step("Read", () => {
      dt.setBigInt64(0, 12n, true);
      const result = type.read(dt);
      assertEquals(result, 12n);
    });

    dt.setBigUint64(0, 0n);

    await t.step("Write", () => {
      type.write(10n, dt);
      assertEquals(dt.getBigInt64(0, true), 10n);
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 9 });
      }, RangeError);
    });
  },
});
