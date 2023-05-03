import { assertEquals } from "std/testing/asserts.ts";
import { f64be, f64le } from "./f64.ts";

Deno.test("f64", async ({ step }) => {
  const buff = new ArrayBuffer(8);
  const dt = new DataView(buff);
  const value = 12.69;

  await step("read", () => {
    // Little endian
    dt.setFloat64(0, value, true);
    assertEquals(value, f64le.read(dt));
    // Big endian
    dt.setFloat64(0, value, false);
    assertEquals(value, f64be.read(dt));
  });

  await step("write", () => {
    // Little endian
    f64le.write(value, dt);
    assertEquals(value, dt.getFloat64(0, true));
    // Big endian
    f64be.write(value, dt);
    assertEquals(value, dt.getFloat64(0, false));
  });
});
