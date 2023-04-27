import { assertEquals, assertThrows } from "std/testing/asserts.ts";
import { nullTerminatedString } from "./null_terminated.ts";

const encoder = new TextEncoder();

Deno.test("NullTerminatedString", async ({ step }) => {
  await step("read", () => {
    assertEquals(
      nullTerminatedString.read(
        new DataView(encoder.encode("Hello world!\0").buffer),
      ),
      "Hello world!",
    );

    assertEquals(
      nullTerminatedString.read(
        new DataView(encoder.encode("Hello\0world!\0").buffer),
      ),
      "Hello",
    );

    assertEquals(
      nullTerminatedString.read(
        new DataView(encoder.encode("Hello\0world!\0").buffer),
        6,
      ),
      "world!",
    );

    assertThrows(
      () =>
        nullTerminatedString.read(
          new DataView(encoder.encode("Hello world!").buffer),
        ),
      "Did not encounter null terminator when attempting to read null terminated string",
    );
  });

  await step("write", () => {
    const dataView = new DataView(new Uint8Array(13).buffer);
    nullTerminatedString.write("Hello world!", dataView);
    assertEquals(dataView.buffer, encoder.encode("Hello world!\0").buffer);
  });
});
