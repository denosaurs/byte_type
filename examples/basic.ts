import { PackedStruct, u32, u8 } from "../types/mod.ts";

const o = new PackedStruct({ "b": u8, "a": u32 }).view(
  new DataView(new ArrayBuffer(5)),
  0,
);

console.log(o.valueOf());
