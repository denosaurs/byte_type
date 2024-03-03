import { BitFlags64 as OBF8 } from "https://raw.githubusercontent.com/denosaurs/byte_type/796f19a5d0e4368b3910aa1e13fac70d59a7221d/mod.ts";
import { BitFlags64 } from "./mod.ts";

const AB = new ArrayBuffer(8);
const DT = new DataView(AB);
const inputRecord = {
  one: 1n,
  two: 2n,
  four: 4n,
  eight: 8n,
  sixteen: 16n,
  thirtytwo: 32n,
  sixtyfour: 64n,
  onetwentyeight: 128n,
};

const dataRecord = {
  one: true,
  two: true,
  four: true,
  eight: true,
  sixteen: true,
  thirtytwo: true,
  sixtyfour: true,
  onetwentyeight: true,
};

const obf = new OBF8(inputRecord);
const nbf = new BitFlags64(inputRecord);

Deno.bench("nop", () => {});

//#region READ BENCHMARKS
Deno.bench({
  name: "Old Read Packed",
  group: "rp",
  fn: () => {
    obf.readPacked(DT);
  },
});
Deno.bench({
  name: "New Read Packed",
  group: "rp",
  fn: () => {
    nbf.readPacked(DT);
  },
});
Deno.bench({
  name: "Old Read",
  group: "r",
  fn: () => {
    obf.read(DT);
  },
});
Deno.bench({
  name: "New Read",
  group: "r",
  fn: () => {
    nbf.read(DT);
  },
});
//#endregion
//#region WRITE BENCHMARKS
Deno.bench({
  name: "Old Write Packed",
  group: "wp",
  fn: () => {
    obf.writePacked(dataRecord, DT);
  },
});
Deno.bench({
  name: "New Write Packed",
  group: "wp",
  fn: () => {
    nbf.writePacked(dataRecord, DT);
  },
});
Deno.bench({
  name: "Old Write",
  group: "w",
  fn: () => {
    obf.write(dataRecord, DT);
  },
});
Deno.bench({
  name: "New Write",
  group: "w",
  fn: () => {
    nbf.write(dataRecord, DT);
  },
});
//#endregion
