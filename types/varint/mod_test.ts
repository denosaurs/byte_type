import { Leb128Varint } from "./mod.ts";
import { assertEquals } from "https://deno.land/std@0.183.0/testing/asserts.ts";

Deno.test({
  name: "Read Positive varint",
  fn: () => {
    let data = Uint8Array.of(127);
    let result = new Leb128Varint().read(new DataView(data.buffer));
    assertEquals(result, 127);

    data = Uint8Array.of(128, 1);
    result = new Leb128Varint().read(new DataView(data.buffer));
    assertEquals(result, 128);

    data = Uint8Array.of(221, 199, 1);
    result = new Leb128Varint().read(new DataView(data.buffer));
    assertEquals(result, 25565);

    data = Uint8Array.of(255, 255, 255, 255, 7);
    result = new Leb128Varint().read(new DataView(data.buffer));
    assertEquals(result, 2147483647);
  },
});

Deno.test({
  name: "Read Negative varint",
  fn: () => {
    let data = Uint8Array.of(255, 255, 255, 255, 15);
    let result = new Leb128Varint().read(new DataView(data.buffer));
    assertEquals(result, -1);

    data = Uint8Array.of(128, 128, 128, 128, 8);
    result = new Leb128Varint().read(new DataView(data.buffer));
    assertEquals(result, -2147483648);
  },
});

Deno.test({
  name: "Write Positive varint",
  fn: () => {
    let data = new Uint8Array(1);
    new Leb128Varint().write(127, new DataView(data.buffer));
    assertEquals(data, Uint8Array.of(127));

    data = new Uint8Array(2);
    new Leb128Varint().write(128, new DataView(data.buffer));
    assertEquals(data, Uint8Array.of(128, 1));


    data = new Uint8Array(3);
    new Leb128Varint().write(25565, new DataView(data.buffer));
    assertEquals(data, Uint8Array.of(221, 199, 1));


    data = new Uint8Array(5);
    new Leb128Varint().write(2147483647, new DataView(data.buffer));
    assertEquals(data, Uint8Array.of(255, 255, 255, 255, 7));
  },
});

Deno.test({
  name: "Write Negative varint",
  fn: () => {
    let data = new Uint8Array(5);
    new Leb128Varint().write(-1, new DataView(data.buffer));
    assertEquals(data, Uint8Array.of(255, 255, 255, 255, 15));

    data = new Uint8Array(5);
    new Leb128Varint().write(-2147483648, new DataView(data.buffer));
    assertEquals(data, Uint8Array.of(128, 128, 128, 128, 8));
  },
});
