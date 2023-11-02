import { u32le } from "./u32.ts";
import { assertEquals, assertThrows } from "../../test_deps.ts";

Deno.test({
  name: "U32",
  fn: async (t) => {
    const ab = new ArrayBuffer(8);
    const dt = new DataView(ab);
    const type = u32le;

    await t.step("Read", () => {
      dt.setUint32(0, 12, true);
      const result = type.read(dt);
      assertEquals(result, 12);
    });

    dt.setBigUint64(0, 0n);

    await t.step("Write", () => {
      type.write(10, dt);
      assertEquals(dt.getUint32(0, true), 10);
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 9 });
      }, RangeError);
    });
  },
});
