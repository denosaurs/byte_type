import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.178.0/testing/asserts.ts";
import { I64LEB128 } from "./leb128.ts";

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
  },
});

Deno.test({
  name: "Write Negative VarLong",
  fn: () => {
  },
});
