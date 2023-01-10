import { Tuple } from "../types/tuple/mod.ts";
import { u32 } from "../types/primitive/u32.ts";

const benchTuple = new Tuple([u32, u32]);
const u32arr = new Uint32Array([2,4]);
const dt = new DataView(u32arr.buffer);


Deno.bench("no-op", () => {});

Deno.bench({
  name: "Original",
  fn: () => {
    benchTuple.read(dt)
  }
})

Deno.bench({
  name: "Write",
  fn: () => {
    benchTuple.write( [4, 2], dt)
  }
})