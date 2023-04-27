import { BitFlags8 } from "./bitflags8.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("bitflags8", async ({ step }) => {
  const buff = new ArrayBuffer(1);
  const dt = new DataView(buff);
  const bitflags8 = new BitFlags8({
    1: 1,
    2: 1 << 1,
    3: 1 << 2,
    4: 1 << 3,
    5: 1 << 4,
    6: 1 << 5,
    7: 1 << 6,
    8: 1 << 7,
  });

  await step("read", () => {
    dt.setUint8(0, 0b11111111);
    assertEquals(bitflags8.read(dt), {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
    });

    dt.setUint8(0, 1);
    assertEquals(bitflags8.read(dt), {
      1: true,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
    });
  });

  await step("write", () => {
    bitflags8.write({
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
    }, dt);
    assertEquals(dt.getUint8(0), 0b11111111);

    bitflags8.write({
      1: true,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
    }, dt);
    assertEquals(dt.getUint8(0), 0b00000001);
  });
});
