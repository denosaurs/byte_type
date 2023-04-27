import { assertEquals, assertThrows } from "std/testing/asserts.ts";
import { i64leb128 } from "./i64leb128.ts";

Deno.test("i64leb128", async ({ step }) => {
  await step("read", async ({ step }) => {
    await step("positive", () => {
      assertEquals(
        i64leb128.read(new DataView(Uint8Array.of(0x01).buffer)),
        1n,
      );
      assertEquals(
        i64leb128.read(new DataView(Uint8Array.of(0xff, 0x01).buffer)),
        255n,
      );
      assertEquals(
        i64leb128.read(
          new DataView(Uint8Array.of(0xff, 0xff, 0xff, 0xff, 0x07).buffer),
        ),
        2147483647n,
      );
      assertEquals(
        i64leb128.read(
          new DataView(
            Uint8Array.of(
              0xff,
              0xff,
              0xff,
              0xff,
              0xff,
              0xff,
              0xff,
              0xff,
              0x7f,
            ).buffer,
          ),
        ),
        9223372036854775807n,
      );
    });

    await step("negative", () => {
      assertEquals(
        i64leb128.read(
          new DataView(
            Uint8Array.of(
              0xff,
              0xff,
              0xff,
              0xff,
              0xff,
              0xff,
              0xff,
              0xff,
              0xff,
              0x01,
            ).buffer,
          ),
        ),
        -1n,
      );
      assertEquals(
        i64leb128.read(
          new DataView(
            Uint8Array.of(
              0x80,
              0x80,
              0x80,
              0x80,
              0xf8,
              0xff,
              0xff,
              0xff,
              0xff,
              0x01,
            ).buffer,
          ),
        ),
        -2147483648n,
      );
      assertEquals(
        i64leb128.read(
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
    });

    await step("bad", () => {
      assertThrows(() =>
        i64leb128.read(
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
    });
  });

  await step("write", async ({ step }) => {
    await step("positive", () => {
      const buff = new Uint8Array(1);
      i64leb128.write(10n, new DataView(buff.buffer));
      assertEquals(buff, Uint8Array.of(10));
    });

    await step("negative", () => {
      const buff = new Uint8Array(10);
      i64leb128.write(-1n, new DataView(buff.buffer));
      assertEquals(
        buff,
        Uint8Array.of(
          0xff,
          0xff,
          0xff,
          0xff,
          0xff,
          0xff,
          0xff,
          0xff,
          0xff,
          0x01,
        ),
      );
    });
  });
});
