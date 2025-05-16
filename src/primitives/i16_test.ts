import { i16le } from "./i16.ts";
import { assertEquals, assertThrows } from "../../test_deps.ts";

Deno.test({
  name: "I16",
  fn: async (t) => {
    const ab = new ArrayBuffer(8);
    const dt = new DataView(ab);
    const type = i16le;

    await t.step("estimate size", () => {
      assertEquals(type.maxSize, 2);
    });
    await t.step("Read", () => {
      dt.setInt16(0, 12, true);
      const result = type.read(dt);
      assertEquals(result, 12);
    });

    dt.setBigUint64(0, 0n);

    await t.step("Write", () => {
      type.write(10, dt);
      assertEquals(dt.getInt16(0, true), 10);
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 9 });
      }, RangeError);
    });
  },
});
