import { Tuple as OTuple } from "https://raw.githubusercontent.com/denosaurs/byte_type/796f19a5d0e4368b3910aa1e13fac70d59a7221d/mod.ts";
import { Tuple, u32, u8 } from "../mod.ts";

const record = [u32, u8];

// @ts-ignore:
const oTuple = new OTuple(record);
const nTuple = new Tuple(record);

const data = [32, 8];
const AB = new ArrayBuffer(256);
const DT = new DataView(AB);

Deno.bench("nop", () => {});

//#region READ BENCHMARKS
Deno.bench({
  name: "Old Read Packed",
  group: "rp",
  fn: () => {
    oTuple.readPacked(DT);
  },
});
Deno.bench({
  name: "New Read Packed",
  group: "rp",
  fn: () => {
    nTuple.readPacked(DT);
  },
});
Deno.bench({
  name: "Old Read",
  group: "r",
  fn: () => {
    oTuple.read(DT);
  },
});
Deno.bench({
  name: "New Read",
  group: "r",
  fn: () => {
    nTuple.read(DT);
  },
});
//#endregion
//#region WRITE BENCHMARKS
Deno.bench({
  name: "Old Write Packed",
  group: "wp",
  fn: () => {
    oTuple.writePacked(data, DT);
  },
});
Deno.bench({
  name: "New Write Packed",
  group: "wp",
  fn: () => {
    nTuple.writePacked(data, DT);
  },
});
Deno.bench({
  name: "Old Write",
  group: "w",
  fn: () => {
    oTuple.write(data, DT);
  },
});
Deno.bench({
  name: "New Write",
  group: "w",
  fn: () => {
    nTuple.write(data, DT);
  },
});
//#endregion
