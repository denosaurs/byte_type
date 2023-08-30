import { u8 } from "./u8.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("u8", async ({ step }) => {
  const buff = new ArrayBuffer(1);
  const dt = new DataView(buff);

  await step("read", () => {
    dt.setUint8(0, 0);
    assertEquals(u8.read(dt), 0);
    dt.setUint8(0, 1);
    assertEquals(u8.read(dt), 1);
  });

  await step("write", () => {
    u8.write(1, dt);
    assertEquals(dt.getUint8(0), 1);
    u8.write(0, dt);
    assertEquals(dt.getUint8(0), 0);
  });
});
