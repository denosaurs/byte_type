import { i16le, i16be } from "./i16.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("i16", async  ({ step }) => {
  const buff = new ArrayBuffer(2);
  const dt = new DataView(buff);
  const value = 12;

  await step("read", () => {
    // Little endian
    dt.setInt16(0, value, true);
    assertEquals(value, i16le.read(dt));
    // Big endian
    dt.setInt16(0, value, false);
    assertEquals(value, i16be.read(dt));
  });

  await step("write", () => {
    // Little endian
    i16le.write(value, dt);
    assertEquals(value, dt.getInt16(0, true));
    // Big endian
    i16be.write(value, dt);
    assertEquals(value, dt.getInt16(0, false));
  });
});
