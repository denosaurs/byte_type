import { cstring } from "./cstring.ts";
import { assertEquals, assertThrows } from "../../test_deps.ts";

Deno.test({
  name: "Cstring",
  fn: async (t) => {
    const ab = new ArrayBuffer(8);
    const dt = new DataView(ab);
    const type = cstring;

    await t.step("estimate size", () => {
      assertEquals(type.maxSize, null);
    });

    await t.step("Read", () => {
      new TextEncoder().encodeInto("Hello", new Uint8Array(ab));
      const result = type.read(dt);
      assertEquals(result, "Hello");
    });

    dt.setBigUint64(0, 0n);

    await t.step("Write", () => {
      type.write("World!", dt);
      assertEquals(
        new TextDecoder().decode(new Uint8Array(ab, 0, 6)),
        "World!",
      );
    });

    await t.step("OOB Read", () => {
      assertThrows(() => {
        type.read(dt, { byteOffset: 9 });
      }, RangeError);
    });
  },
});
