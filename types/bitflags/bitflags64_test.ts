import { BitFlags64 } from "./bitflags64.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("bitflags64", async ({ step }) => {
  const buff = new ArrayBuffer(8);
  const dt = new DataView(buff);
  const bitflags64 = new BitFlags64({
    1: 1n,
    2: BigInt(1 << 1),
    3: BigInt(1 << 2),
    4: BigInt(1 << 3),
    5: BigInt(1 << 4),
    6: BigInt(1 << 5),
    7: BigInt(1 << 6),
    8: BigInt(1 << 7),
  });

  await step("read", () => {
    dt.setUint8(7, 0b11111111);
    assertEquals(bitflags64.read(dt), {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
    });

    dt.setUint8(7, 1);
    assertEquals(bitflags64.read(dt), {
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
    bitflags64.write({
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
    }, dt);
    assertEquals(dt.getUint8(7), 0b11111111);

    bitflags64.write({
      1: true,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
    }, dt);
    assertEquals(dt.getUint8(7), 0b00000001);
  });
});
