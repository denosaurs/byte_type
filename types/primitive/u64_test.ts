import { u64le, u64be } from "./u64.ts";
import { assertEquals } from "https://deno.land/std@0.178.0/testing/asserts.ts";

Deno.test("u64", async  ({ step }) => {
  const buff = new ArrayBuffer(8);
  const dt = new DataView(buff);
  const value = 12n;

  await step("read", () => {
    // Little endian
    dt.setBigUint64(0, value, true);
    assertEquals(value, u64le.read(dt));
    // Big endian
    dt.setBigUint64(0, value, false);
    assertEquals(value, u64be.read(dt));
  });

  await step("write", () => {
    // Little endian
    u64le.write(value, dt);
    assertEquals(value, dt.getBigUint64(0, true));
    // Big endian
    u64be.write(value, dt);
    assertEquals(value, dt.getBigUint64(0, false));
  });
});
