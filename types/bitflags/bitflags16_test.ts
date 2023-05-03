import { BitFlags16 } from "./bitflags16.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("bitflags16", async ({ step }) => {
  const buff = new ArrayBuffer(2);
  const dt = new DataView(buff);
  const bitflags16 = new BitFlags16({
    1: 1 << 8,
    2: 1 << 9,
    3: 1 << 10,
    4: 1 << 11,
    5: 1 << 12,
    6: 1 << 13,
    7: 1 << 14,
    8: 1 << 15,
  });

  await step("read", () => {
    dt.setUint16(0, 0b1111111100000000);
    assertEquals(bitflags16.read(dt), {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
    });

    dt.setUint16(0, 0b0000000100000000);
    assertEquals(bitflags16.read(dt), {
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
    bitflags16.write({
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
    }, dt);
    assertEquals(dt.getUint16(0), 0b1111111100000000);

    bitflags16.write({
      1: true,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
    }, dt);
    assertEquals(dt.getUint16(0), 0b0000000100000000);
  });
});
