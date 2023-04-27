import { assertAlmostEquals } from "std/testing/asserts.ts";
import { f32be, f32le } from "./f32.ts";

Deno.test("f32", async ({ step }) => {
  const buff = new ArrayBuffer(4);
  const dt = new DataView(buff);
  const value = 12.69;

  await step("read", () => {
    // Little endian
    dt.setFloat32(0, value, true);
    assertAlmostEquals(value, f32le.read(dt), 0.01);
    // Big endian
    dt.setFloat32(0, value, false);
    assertAlmostEquals(value, f32be.read(dt), 0.01);
  });

  await step("write", () => {
    // Little endian
    f32le.write(value, dt);
    assertAlmostEquals(value, dt.getFloat32(0, true), 0.01);
    // Big endian
    f32be.write(value, dt);
    assertAlmostEquals(value, dt.getFloat32(0, false), 0.01);
  });
});
