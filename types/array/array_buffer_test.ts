import { ArrayBufferType } from "./array_buffer.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("Array Buffer", async ({ step }) => {
  const ab = new ArrayBuffer(4);
  const dt = new DataView(ab);
  const byteView = new Uint8Array(ab);
  const abType = new ArrayBufferType(4);

  await step("read", () => {
    byteView.set([1, 2, 3, 4]);
    const newAB = abType.read(dt);
    assertEquals(new Uint8Array(newAB), byteView);
  });

  await step("write", () => {
    byteView.set([0, 0, 0, 0]);
    abType.write(Uint8Array.of(1, 2, 3, 4).buffer, dt);

    assertEquals(byteView, Uint8Array.of(1, 2, 3, 4));
  });
});
