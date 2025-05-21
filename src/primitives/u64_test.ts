import { u64le } from "./u64.ts";
import { assertEquals, assertThrows } from "../../test_deps.ts";

Deno.test({
  name: "U64",
  fn: async (t) => {
    const ab = new ArrayBuffer(8);
    const dt = new DataView(ab);
    const type = u64le;

    await t.step("estimate size", () => {
      assertEquals(type.maxSize, 8);
    });

    await t.step("Read", () => {
      dt.setBigUint64(0, 12n, true);
      const result = type.read(dt);
      assertEquals(result, 12n);
    });

    dt.setBigUint64(0, 0n);

    await t.step("Write", () => {
      type.write(10n, dt);
      assertEquals(dt.getBigUint64(0, true), 10n);
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 9 });
      }, RangeError);
    });
  },
});
