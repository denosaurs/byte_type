import { assertEquals } from "https://deno.land/std@0.184.0/testing/asserts.ts";
import { FixedLengthString } from "./fixed_length.ts";

Deno.test("Fixed Length String", async ({step}) => {
  const value = "Lorem Ipsum";
  const buffer = new ArrayBuffer(value.length);
  const dt = new DataView(buffer);
  const fixedLengthStringType = new FixedLengthString(value.length);

  await step("read", () => {
    const byteView = new Uint8Array(buffer);
    byteView.set(value.split("").map(x => x.charCodeAt(0)));
    assertEquals(fixedLengthStringType.read(dt) , value);
  });

  await step("write", () => {
    const byteView = new Uint8Array(buffer);
    fixedLengthStringType.write("LOREM IPSUM", dt);
    assertEquals(new TextDecoder().decode(byteView), value.toUpperCase());
  });
})