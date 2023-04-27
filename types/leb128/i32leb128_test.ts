import { assertEquals, assertThrows } from "std/testing/asserts.ts";
import { i32leb128 } from "./mod.ts";

Deno.test("i32leb128", async ({ step }) => {
  await step("read", async ({ step }) => {
    await step("positive", () => {
      const options = { byteOffset: 0 };
      let data = Uint8Array.of(127);
      let result = i32leb128.read(new DataView(data.buffer), options);
      assertEquals(result, 127);
      assertEquals(options.byteOffset, 1);

      options.byteOffset = 0;
      data = Uint8Array.of(128, 1);
      result = i32leb128.read(new DataView(data.buffer), options);
      assertEquals(result, 128);
      assertEquals(options.byteOffset, 2);

      options.byteOffset = 0;
      data = Uint8Array.of(221, 199, 1);
      result = i32leb128.read(new DataView(data.buffer), options);
      assertEquals(result, 25565);
      assertEquals(options.byteOffset, 3);

      options.byteOffset = 0;
      data = Uint8Array.of(255, 255, 255, 255, 7);
      result = i32leb128.read(new DataView(data.buffer), options);
      assertEquals(result, 2147483647);
      assertEquals(options.byteOffset, 5);
    });

    await step("negative", () => {
      const options = { byteOffset: 0 };
      let data = Uint8Array.of(255, 255, 255, 255, 15);
      let result = i32leb128.read(new DataView(data.buffer), options);
      assertEquals(result, -1);
      assertEquals(options.byteOffset, 5);

      options.byteOffset = 0;
      data = Uint8Array.of(128, 128, 128, 128, 8);
      result = i32leb128.read(new DataView(data.buffer), options);
      assertEquals(result, -2147483648);
      assertEquals(options.byteOffset, 5);
    });

    await step("bad", () => {
      const data = Uint8Array.of(255, 255, 255, 255, 255, 15);
      assertThrows(() => i32leb128.read(new DataView(data.buffer)));
    });

    await step("i32 max", () => {
      const data = Uint8Array.of(255, 255, 255, 255, 7);
      assertEquals(i32leb128.read(new DataView(data.buffer)), 2147483647);
    });
  });

  await step("write", async ({ step }) => {
    await step("positive", () => {
      const options = { byteOffset: 0 };
      let data = new Uint8Array(1);
      i32leb128.write(127, new DataView(data.buffer), options);
      assertEquals(data, Uint8Array.of(127));
      assertEquals(options.byteOffset, 1);

      options.byteOffset = 0;
      data = new Uint8Array(2);
      i32leb128.write(128, new DataView(data.buffer), options);
      assertEquals(data, Uint8Array.of(128, 1));
      assertEquals(options.byteOffset, 2);

      options.byteOffset = 0;
      data = new Uint8Array(3);
      i32leb128.write(25565, new DataView(data.buffer), options);
      assertEquals(data, Uint8Array.of(221, 199, 1));
      assertEquals(options.byteOffset, 3);

      options.byteOffset = 0;
      data = new Uint8Array(5);
      i32leb128.write(2147483647, new DataView(data.buffer), options);
      assertEquals(data, Uint8Array.of(255, 255, 255, 255, 7));
      assertEquals(options.byteOffset, 5);
    });

    await step("negative", () => {
      const options = { byteOffset: 0 };
      let data = new Uint8Array(5);
      i32leb128.write(-1, new DataView(data.buffer), options);
      assertEquals(data, Uint8Array.of(255, 255, 255, 255, 15));
      assertEquals(options.byteOffset, 5);

      options.byteOffset = 0;
      data = new Uint8Array(5);
      i32leb128.write(-2147483648, new DataView(data.buffer), options);
      assertEquals(data, Uint8Array.of(128, 128, 128, 128, 8));
      assertEquals(options.byteOffset, 5);
    });

    await step("i32 max", () => {
      const data = new Uint8Array(5);
      i32leb128.write(2147483647, new DataView(data.buffer));
      assertEquals(data, Uint8Array.of(255, 255, 255, 255, 7));
    });
  });
});
