import { u32le, u32be } from "./u32.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("u32", async  ({ step }) => {
  const buff = new ArrayBuffer(4);
  const dt = new DataView(buff);
  const value = 12;

  await step("read", () => {
    // Little endian
    dt.setUint32(0, value, true);
    assertEquals(value, u32le.read(dt));
    // Big endian
    dt.setUint32(0, value, false);
    assertEquals(value, u32be.read(dt));
  });

  await step("write", () => {
    // Little endian
    u32le.write(value, dt);
    assertEquals(value, dt.getUint32(0, true));
    // Big endian
    u32be.write(value, dt);
    assertEquals(value, dt.getUint32(0, false));
  });
});
