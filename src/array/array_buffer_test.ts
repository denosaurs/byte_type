import { ArrayBufferType } from "./array_buffer.ts";
import { assertEquals, assertThrows } from "../../test_deps.ts";

Deno.test({
  name: "ArrayBufferType",
  fn: async (t) => {
    const ab = new ArrayBuffer(2);
    const dt = new DataView(ab);
    dt.setUint16(0, 0xFF);

    const type = new ArrayBufferType(2);
    await t.step("Read", () => {
      const newAb = type.read(dt);
      assertEquals(new Uint8Array(newAb), new Uint8Array(ab));
    });

    await t.step("Write", () => {
      const newAb = new ArrayBuffer(2);
      type.write(newAb, dt);
      assertEquals(new Uint8Array(ab), new Uint8Array(newAb));
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 2 });
      }, RangeError);
    });
  },
});
