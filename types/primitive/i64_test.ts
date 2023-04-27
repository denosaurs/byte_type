import { i64le, i64be } from "./i64.ts";
import { assertEquals } from "https://deno.land/std@0.178.0/testing/asserts.ts";

Deno.test("i64", async  ({ step }) => {
  const buff = new ArrayBuffer(8);
  const dt = new DataView(buff);
  const value = 12n;

  await step("read", () => {
    // Little endian
    dt.setBigInt64(0, value, true);
    assertEquals(value, i64le.read(dt));
    // Big endian
    dt.setBigInt64(0, value, false);
    assertEquals(value, i64be.read(dt));
  });

  await step("write", () => {
    // Little endian
    i64le.write(value, dt);
    assertEquals(value, dt.getBigInt64(0, true));
    // Big endian
    i64be.write(value, dt);
    assertEquals(value, dt.getBigInt64(0, false));
  });
});
