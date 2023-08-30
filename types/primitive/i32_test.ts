import { i32be, i32le } from "./i32.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("i32", async ({ step }) => {
  const buff = new ArrayBuffer(4);
  const dt = new DataView(buff);
  const value = 12;

  await step("read", () => {
    // Little endian
    dt.setInt32(0, value, true);
    assertEquals(value, i32le.read(dt));
    // Big endian
    dt.setInt32(0, value, false);
    assertEquals(value, i32be.read(dt));
  });

  await step("write", () => {
    // Little endian
    i32le.write(value, dt);
    assertEquals(value, dt.getInt32(0, true));
    // Big endian
    i32be.write(value, dt);
    assertEquals(value, dt.getInt32(0, false));
  });
});
