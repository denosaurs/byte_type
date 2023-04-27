import { assertEquals, assertThrows } from "std/testing/asserts.ts";
import { i64leb128 } from "./i64leb128.ts";

Deno.test("i64leb128", async ({ step }) => {
  await step("read", async ({ step }) => {
    await step("positive", () => {
      const options = { byteOffset: 0 };
      assertEquals(
        i64leb128.read(new DataView(Uint8Array.of(0x01).buffer), options),
        1n,
      );
      assertEquals(options.byteOffset, 1);

      options.byteOffset = 0;
      assertEquals(
        i64leb128.read(new DataView(Uint8Array.of(0xff, 0x01).buffer), options),
        255n,
      );
      assertEquals(options.byteOffset, 2);

      options.byteOffset = 0;
      assertEquals(
        i64leb128.read(
          new DataView(Uint8Array.of(0xff, 0xff, 0xff, 0xff, 0x07).buffer),
          options,
        ),
        2147483647n,
      );
      assertEquals(options.byteOffset, 5);

      options.byteOffset = 0;
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
          options,
        ),
        9223372036854775807n,
      );
      assertEquals(options.byteOffset, 9);
    });

    await step("negative", () => {
      const options = { byteOffset: 0 };
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
          options,
        ),
        -1n,
      );
      assertEquals(options.byteOffset, 10);

      options.byteOffset = 0;
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
          options,
        ),
        -2147483648n,
      );
      assertEquals(options.byteOffset, 10);

      options.byteOffset = 0;
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
          options,
        ),
        -9223372036854775808n,
      );
      assertEquals(options.byteOffset, 10);
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
      const options = { byteOffset: 0 };
      const data = new Uint8Array(1);
      i64leb128.write(10n, new DataView(data.buffer), options);
      assertEquals(data, Uint8Array.of(10));
      assertEquals(options.byteOffset, 1);
    });

    await step("negative", () => {
      const options = { byteOffset: 0 };
      const data = new Uint8Array(10);
      i64leb128.write(-1n, new DataView(data.buffer), options);
      assertEquals(
        data,
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
      assertEquals(options.byteOffset, 10);
    });
  });
});
