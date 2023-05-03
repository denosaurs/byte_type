import { i8 } from "./i8.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("i8", async ({ step }) => {
  const buff = new ArrayBuffer(1);
  const dt = new DataView(buff);

  await step("read", () => {
    dt.setInt8(0, 0);
    assertEquals(i8.read(dt), 0);
    dt.setInt8(0, 1);
    assertEquals(i8.read(dt), 1);
  });

  await step("write", () => {
    i8.write(1, dt);
    assertEquals(dt.getInt8(0), 1);
    i8.write(0, dt);
    assertEquals(dt.getInt8(0), 0);
  });
});
