import { AlignedStruct } from "../types/struct/mod.ts";
import { u32 } from "../types/primitive/mod.ts";

const data = new DataView(new ArrayBuffer(8));

const object = { a: 123, b: 456 };
const struct = new AlignedStruct({
  a: u32,
  b: u32,
});
const view = struct.view(data);

Deno.bench("no-op", () => {});

Deno.bench({
  baseline: true,
  name: "object",
  group: "read",
  fn: () => {
    object.a;
    object.b;
  },
});

Deno.bench({
  name: "struct",
  group: "read",
  fn: () => {
    struct.read(data);
  },
});

Deno.bench({
  name: "view",
  group: "read",
  fn: () => {
    view.a;
    view.b;
  },
});

Deno.bench({
  name: "DataView",
  group: "read",
  fn: () => {
    data.getUint32(0);
    data.getUint32(4);
  },
});

Deno.bench({
  baseline: true,
  name: "object",
  group: "write",
  fn: () => {
    object.a = 0xffff;
    object.b = 0xffff;
  },
});

Deno.bench({
  name: "struct",
  group: "write",
  fn: () => {
    struct.write({
      a: 0xffff,
      b: 0xffff,
    }, data);
  },
});

Deno.bench({
  name: "view",
  group: "write",
  fn: () => {
    view.a = 0xffff;
    view.b = 0xffff;
  },
});

Deno.bench({
  name: "DataView",
  group: "write",
  fn: () => {
    data.setUint32(0, 0xffff);
    data.setUint32(4, 0xffff);
  },
});
