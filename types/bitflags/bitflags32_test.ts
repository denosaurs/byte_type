import { BitFlags32 } from "./bitflags32.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("bitflags32", async ({ step }) => {
  const buff = new ArrayBuffer(4);
  const dt = new DataView(buff);
  const bitflags32 = new BitFlags32({
    16: 0x10000,
    17: 0x20000,
    18: 0x40000,
    19: 0x80000,
    20: 0x100000,
    21: 0x200000,
    22: 0x400000,
    23: 0x800000,
    24: 0x1000000,
    25: 0x2000000,
    26: 0x4000000,
    27: 0x8000000,
    28: 0x10000000,
    29: 0x20000000,
    30: 0x40000000,
    31: 0x80000000,
  });

  await step("read", () => {
    dt.setUint32(0, 0xFFFF0000);
    assertEquals(bitflags32.read(dt), {
      16: true,
      17: true,
      18: true,
      19: true,
      20: true,
      21: true,
      22: true,
      23: true,
      24: true,
      25: true,
      26: true,
      27: true,
      28: true,
      29: true,
      30: true,
      31: true,
    });

    dt.setUint32(0, 0x10000);
    assertEquals(bitflags32.read(dt), {
      16: true,
      17: false,
      18: false,
      19: false,
      20: false,
      21: false,
      22: false,
      23: false,
      24: false,
      25: false,
      26: false,
      27: false,
      28: false,
      29: false,
      30: false,
      31: false,
    });
  });

  await step("write", () => {
    bitflags32.write({
      16: true,
      17: true,
      18: true,
      19: true,
      20: true,
      21: true,
      22: true,
      23: true,
      24: true,
      25: true,
      26: true,
      27: true,
      28: true,
      29: true,
      30: true,
      31: true,
    }, dt);
    assertEquals(dt.getUint32(0), 0xFFFF0000);

    bitflags32.write({
      16: true,
      17: false,
      18: false,
      19: false,
      20: false,
      21: false,
      22: false,
      23: false,
      24: false,
      25: false,
      26: false,
      27: false,
      28: false,
      29: false,
      30: false,
      31: false,
    }, dt);
    assertEquals(dt.getUint32(0), 0x10000);
  });
});
