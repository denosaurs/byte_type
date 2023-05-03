import { assertEquals } from "https://deno.land/std@0.184.0/testing/asserts.ts";
import { u8 } from "../primitive/u8.ts";
import { ArrayType } from "./array.ts";

Deno.test("Array Type", async ({ step }) => {
  const ab = new ArrayBuffer(2);
  const dt = new DataView(ab);
  const byteView = new Uint8Array(ab);
  const byteArray = new ArrayType(u8, 2);

  await step("read", () => {
    byteView.set([1, 2]);
    assertEquals(byteArray.read(dt), [1, 2]);
  });

  await step("write", () => {
    byteArray.write([3, 4], dt);
    assertEquals(byteView, Uint8Array.of(3, 4));
  });
});
