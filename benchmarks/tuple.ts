import { Tuple, u32 } from "../mod.ts";

const benchTuple = new Tuple([u32, u32]);
const u32arr = new Uint32Array([2, 4]);
const dt = new DataView(u32arr.buffer);

Deno.bench("no-op", () => {});

Deno.bench({
  name: "Read",
  fn: () => {
    benchTuple.read(dt);
  },
});

Deno.bench({
  name: "Write",
  fn: () => {
    benchTuple.write([4, 2], dt);
  },
});
