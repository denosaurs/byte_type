import { PackedStruct } from "../types/structs/mod.ts";
import { u32, u8 } from "../types/primitives/mod.ts";

const o = new PackedStruct({ "b": u8, "a": u32 }).object(
  new DataView(new ArrayBuffer(5)),
  0,
);

console.log(o.valueOf());
