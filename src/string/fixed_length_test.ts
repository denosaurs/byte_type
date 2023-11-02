import { asciiChar } from "./fixed_length.ts";
import { assertEquals, assertThrows } from "../../test_deps.ts";

const decoder = new TextDecoder();
const encoder = new TextEncoder();

Deno.test({
  name: "Fixed Length",
  fn: async (t) => {
    const ab = new ArrayBuffer(8);
    const dt = new DataView(ab);
    const view = new Uint8Array(ab);
    const type = asciiChar;

    await t.step("Read", () => {
      encoder.encodeInto("H", view);
      const result = type.read(dt);
      assertEquals(result, "H");
    });

    dt.setBigUint64(0, 0n);

    await t.step("Write", () => {
      type.write("W", dt);
      assertEquals(decoder.decode(view.subarray(0, 1)), "W");
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 9 });
      }, RangeError);
    });
  },
});
