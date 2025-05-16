import { assertEquals, assertThrows } from "../../test_deps.ts";
import { i128be, i128le, u128be, u128le } from "./big_numbers.ts";

Deno.test("u128", async (t) => {
  const buff = new ArrayBuffer(16);
  const dt = new DataView(buff);
  const value = 12n;

  await t.step("estimate size", () => {
    assertEquals(u128be.maxSize, 16);
  });
  await t.step("read", () => {
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

  await t.step("write", () => {
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

  await t.step("OOB Read", () => {
    assertThrows(() => {
      u128le.read(dt, { byteOffset: 9 });
    }, RangeError);
  });
});

Deno.test("i128", async (t) => {
  const buff = new ArrayBuffer(16);
  const dt = new DataView(buff);
  const value = 12n;

  await t.step("estimate size", () => {
    assertEquals(i128be.maxSize, 16);
  });
  await t.step("read", () => {
    // Little endian
    const lo = value & 0xffffffffffffffffn;
    const hi = value >> 64n;
    dt.setBigUint64(0, lo, true);
    dt.setBigUint64(8, hi, true);
    assertEquals(value, i128le.read(dt));
    // Big endian
    dt.setBigUint64(0, hi, false);
    dt.setBigUint64(8, lo, false);
    assertEquals(value, i128be.read(dt));
  });

  await t.step("write", () => {
    // Little endian
    i128le.write(value, dt);
    let lo = dt.getBigInt64(0, true);
    let hi = dt.getBigInt64(8, true);
    assertEquals(value, (lo << 64n) | hi);
    // Big endian
    i128be.write(value, dt);
    lo = dt.getBigInt64(8, false);
    hi = dt.getBigInt64(0, false);
    assertEquals(value, (lo << 64n) | hi);
  });

  await t.step("OOB Read", () => {
    assertThrows(() => {
      i128le.read(dt, { byteOffset: 9 });
    }, RangeError);
  });
});
