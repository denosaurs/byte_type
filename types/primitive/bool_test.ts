import { bool } from "./bool.ts";
import { assertEquals } from "https://deno.land/std@0.178.0/testing/asserts.ts";

Deno.test("Boolean", async  ({ step }) => {
  const buff = new ArrayBuffer(1);
  const dt = new DataView(buff);

  await step("read", () => {
    dt.setInt8(0, 0);
    assertEquals(bool.read(dt), false);
    dt.setInt8(0, 1);
    assertEquals(bool.read(dt), true);
  });

  await step("write", () => {
    bool.write(true, dt);
    assertEquals(dt.getInt8(0), 1);
    bool.write(false, dt);
    assertEquals(dt.getInt8(0), 0);
  });
});
