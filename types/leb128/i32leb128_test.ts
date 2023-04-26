import { assertEquals, assertThrows } from "std/testing/asserts.ts";
import { i32leb128 } from "./mod.ts";

Deno.test("i32leb128", async ({ step }) => {
  await step("read", async ({ step }) => {
    await step("positive", () => {
      let data = Uint8Array.of(127);
      let result = i32leb128.read(new DataView(data.buffer));
      assertEquals(result, 127);

      data = Uint8Array.of(128, 1);
      result = i32leb128.read(new DataView(data.buffer));
      assertEquals(result, 128);

      data = Uint8Array.of(221, 199, 1);
      result = i32leb128.read(new DataView(data.buffer));
      assertEquals(result, 25565);

      data = Uint8Array.of(255, 255, 255, 255, 7);
      result = i32leb128.read(new DataView(data.buffer));
      assertEquals(result, 2147483647);
    });

    await step("negative", () => {
      let data = Uint8Array.of(255, 255, 255, 255, 15);
      let result = i32leb128.read(new DataView(data.buffer));
      assertEquals(result, -1);

      data = Uint8Array.of(128, 128, 128, 128, 8);
      result = i32leb128.read(new DataView(data.buffer));
      assertEquals(result, -2147483648);
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
      let data = new Uint8Array(1);
      i32leb128.write(127, new DataView(data.buffer));
      assertEquals(data, Uint8Array.of(127));

      data = new Uint8Array(2);
      i32leb128.write(128, new DataView(data.buffer));
      assertEquals(data, Uint8Array.of(128, 1));

      data = new Uint8Array(3);
      i32leb128.write(25565, new DataView(data.buffer));
      assertEquals(data, Uint8Array.of(221, 199, 1));

      data = new Uint8Array(5);
      i32leb128.write(2147483647, new DataView(data.buffer));
      assertEquals(data, Uint8Array.of(255, 255, 255, 255, 7));
    });

    await step("negative", () => {
      let data = new Uint8Array(5);
      i32leb128.write(-1, new DataView(data.buffer));
      assertEquals(data, Uint8Array.of(255, 255, 255, 255, 15));

      data = new Uint8Array(5);
      i32leb128.write(-2147483648, new DataView(data.buffer));
      assertEquals(data, Uint8Array.of(128, 128, 128, 128, 8));
    });

    await step("i32 max", () => {
      const data = new Uint8Array(5);
      i32leb128.write(2147483647, new DataView(data.buffer));
      assertEquals(data, Uint8Array.of(255, 255, 255, 255, 7));
    });
  });
});
