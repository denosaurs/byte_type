import { u128be, u128le } from "./u128.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("u128", async ({ step }) => {
  const buff = new ArrayBuffer(16);
  const dt = new DataView(buff);
  const value = 12n;

  await step("read", () => {
    // Little endian
    const lo = value & 0xffffffffffffffffn;
    const hi = value >> 64n;
    dt.setBigUint64(0, lo, true);
    dt.setBigUint64(8, hi, true);
    assertEquals(value, u128le.read(dt));
    // Big endian
    dt.setBigUint64(0, hi, false);
    dt.setBigUint64(8, lo, false);
    assertEquals(value, u128be.read(dt));
  });

  await step("write", () => {
    // Little endian
    u128le.write(value, dt);
    let lo = dt.getBigInt64(0, true);
    let hi = dt.getBigInt64(8, true);
    assertEquals(value, (lo << 64n) | hi);
    // Big endian
    u128be.write(value, dt);
    lo = dt.getBigInt64(8, false);
    hi = dt.getBigInt64(0, false);
    assertEquals(value, (lo << 64n) | hi);
  });
});
