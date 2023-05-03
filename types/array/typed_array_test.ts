import { assertEquals } from "std/testing/asserts.ts";
import { TypedArrayType } from "./typed_array.ts";

Deno.test("TypedArray", async ({ step }) => {
  const ab = new ArrayBuffer(2);
  const byteView = new Uint8Array(ab);
  const dt = new DataView(ab);
  const typedArray = new TypedArrayType(Uint8Array, 2);
  await step("read", () => {
    byteView.set([1, 2]);
    assertEquals(typedArray.read(dt), Uint8Array.of(1, 2));
  });

  await step("write", () => {
    typedArray.write(Uint8Array.of(3, 4), dt);
    assertEquals(byteView, Uint8Array.of(3, 4));
  });
});
