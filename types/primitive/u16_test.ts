import { u16le, u16be } from "./u16.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("u16", async  ({ step }) => {
  const buff = new ArrayBuffer(2);
  const dt = new DataView(buff);
  const value = 12;

  await step("read", () => {
    // Little endian
    dt.setUint16(0, value, true);
    assertEquals(value, u16le.read(dt));
    // Big endian
    dt.setUint16(0, value, false);
    assertEquals(value, u16be.read(dt));
  });

  await step("write", () => {
    // Little endian
    u16le.write(value, dt);
    assertEquals(value, dt.getUint16(0, true));
    // Big endian
    u16be.write(value, dt);
    assertEquals(value, dt.getUint16(0, false));
  });
});
