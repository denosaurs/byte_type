import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.178.0/testing/asserts.ts";
import { I64LEB128 } from "./leb128.ts";
import { I32LEB128 } from "./mod.ts";

Deno.test({
  name: "Read Positive VarLong",
  fn: () => {
    const decoder = new I64LEB128();

    assertEquals(decoder.read(new DataView(Uint8Array.of(0x01).buffer)), 1n);
    assertEquals(
      decoder.read(new DataView(Uint8Array.of(0xFF, 0x01).buffer)),
      255n,
    );
    assertEquals(
      decoder.read(
        new DataView(Uint8Array.of(0xFF, 0xFF, 0xFF, 0xFF, 0x07).buffer),
      ),
      2147483647n,
    );
    assertEquals(
      decoder.read(
        new DataView(
          Uint8Array.of(0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x7F)
            .buffer,
        ),
      ),
      9223372036854775807n,
    );
  },
});

Deno.test({
  name: "Read Negative VarLong",
  fn: () => {
    const decoder = new I64LEB128();

    assertEquals(
      decoder.read(
        new DataView(
          Uint8Array.of(
            0xFF,
            0xFF,
            0xFF,
            0xFF,
            0xFF,
            0xFF,
            0xFF,
            0xFF,
            0xFF,
            0x01,
          ).buffer,
        ),
      ),
      -1n,
    );
    assertEquals(
      decoder.read(
        new DataView(
          Uint8Array.of(
            0x80,
            0x80,
            0x80,
            0x80,
            0xF8,
            0xFF,
            0xFF,
            0xFF,
            0xFF,
            0x01,
          ).buffer,
        ),
      ),
      -2147483648n,
    );
    assertEquals(
      decoder.read(
        new DataView(
          Uint8Array.of(
            0x80,
            0x80,
            0x80,
            0x80,
            0x80,
            0x80,
            0x80,
            0x80,
            0x80,
            0x01,
          ).buffer,
        ),
      ),
      -9223372036854775808n,
    );
  },
});

Deno.test({
  name: "Read Bad Varlong",
  fn: () => {
    const decoder = new I64LEB128();
    assertThrows(() =>
      decoder.read(
        new DataView(
          Uint8Array.of(
            0x80,
            0x80,
            0x80,
            0x80,
            0x80,
            0x80,
            0x80,
            0x80,
            0x80,
            0x80,
            0x01,
          ).buffer,
        ),
      )
    );
  },
});

Deno.test({
  name: "Write Positive VarLong",
  fn: () => {
    const encoder = new I64LEB128();
    const buff = new Uint8Array(1);
    encoder.write(10n, new DataView(buff.buffer));
    assertEquals(buff, Uint8Array.of(10));
  },
});

Deno.test({
  name: "Write Negative VarLong",
  fn: () => {
    const encoder = new I64LEB128();
    const buff = new Uint8Array(10);
    encoder.write(-1n, new DataView(buff.buffer));
    assertEquals(
      buff,
      Uint8Array.of(
        0xFF,
        0xFF,
        0xFF,
        0xFF,
        0xFF,
        0xFF,
        0xFF,
        0xFF,
        0xFF,
        0x01,
      ),
    );
  },
});

Deno.test({
  name: "Read Positive varint",
  fn: () => {
    let data = Uint8Array.of(127);
    let result = new I32LEB128().read(new DataView(data.buffer));
    assertEquals(result, 127);

    data = Uint8Array.of(128, 1);
    result = new I32LEB128().read(new DataView(data.buffer));
    assertEquals(result, 128);

    data = Uint8Array.of(221, 199, 1);
    result = new I32LEB128().read(new DataView(data.buffer));
    assertEquals(result, 25565);

    data = Uint8Array.of(255, 255, 255, 255, 7);
    result = new I32LEB128().read(new DataView(data.buffer));
    assertEquals(result, 2147483647);
  },
});

Deno.test({
  name: "Read Negative varint",
  fn: () => {
    let data = Uint8Array.of(255, 255, 255, 255, 15);
    let result = new I32LEB128().read(new DataView(data.buffer));
    assertEquals(result, -1);

    data = Uint8Array.of(128, 128, 128, 128, 8);
    result = new I32LEB128().read(new DataView(data.buffer));
    assertEquals(result, -2147483648);
  },
});

Deno.test({
  name: "Read Bad varint",
  fn: () => {
    const data = Uint8Array.of(255, 255, 255, 255, 255, 15);
    assertThrows(() => new I32LEB128().read(new DataView(data.buffer)));
  },
});

Deno.test({
  name: "Write Positive varint",
  fn: () => {
    let data = new Uint8Array(1);
    new I32LEB128().write(127, new DataView(data.buffer));
    assertEquals(data, Uint8Array.of(127));

    data = new Uint8Array(2);
    new I32LEB128().write(128, new DataView(data.buffer));
    assertEquals(data, Uint8Array.of(128, 1));

    data = new Uint8Array(3);
    new I32LEB128().write(25565, new DataView(data.buffer));
    assertEquals(data, Uint8Array.of(221, 199, 1));

    data = new Uint8Array(5);
    new I32LEB128().write(2147483647, new DataView(data.buffer));
    assertEquals(data, Uint8Array.of(255, 255, 255, 255, 7));
  },
});

Deno.test({
  name: "Write Negative varint",
  fn: () => {
    let data = new Uint8Array(5);
    new I32LEB128().write(-1, new DataView(data.buffer));
    assertEquals(data, Uint8Array.of(255, 255, 255, 255, 15));

    data = new Uint8Array(5);
    new I32LEB128().write(-2147483648, new DataView(data.buffer));
    assertEquals(data, Uint8Array.of(128, 128, 128, 128, 8));
  },
});

Deno.test({
  name: "Write & read i32 MAX",
  fn: () => {
    const value = 2_147_483_647;
    const decoder = new I32LEB128();
    const bytes = new Uint8Array(5);
    const dt = new DataView(bytes.buffer);
    decoder.write(value, dt, 0);
    const decodedValue = decoder.read(dt);
    assertEquals(decodedValue, value);
  },
});
