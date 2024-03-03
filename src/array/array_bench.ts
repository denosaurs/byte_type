import { ArrayType as OArrayType } from "https://raw.githubusercontent.com/denosaurs/byte_type/796f19a5d0e4368b3910aa1e13fac70d59a7221d/mod.ts";
import { ArrayType, u8 } from "../../mod.ts";

const SIZE = 10;
const DATA = new Array(SIZE).fill(0).map((_, i) => i);
const AB = new Uint8Array(SIZE).map((_, i) => i).buffer;
const DT = new DataView(AB);

const atn = new ArrayType(u8, SIZE);
const ato = new OArrayType(u8, SIZE);

Deno.bench("nop", () => {});
//#region READ BENCHMARKS
Deno.bench({
  name: "Old Read Packed",
  group: "rp",
  fn: () => {
    ato.readPacked(DT);
  },
});
Deno.bench({
  name: "New Read Packed",
  group: "rp",
  fn: () => {
    atn.readPacked(DT);
  },
});
Deno.bench({
  name: "Old Read",
  group: "r",
  fn: () => {
    ato.read(DT);
  },
});
Deno.bench({
  name: "New Read",
  group: "r",
  fn: () => {
    atn.read(DT);
  },
});
//#endregion
//#region WRITE BENCHMARKS
Deno.bench({
  name: "Old Write Packed",
  group: "wp",
  fn: () => {
    ato.writePacked(DATA, DT);
  },
});
Deno.bench({
  name: "New Write Packed",
  group: "wp",
  fn: () => {
    atn.writePacked(DATA, DT);
  },
});
Deno.bench({
  name: "Old Write",
  group: "w",
  fn: () => {
    ato.write(DATA, DT);
  },
});
Deno.bench({
  name: "New Write",
  group: "w",
  fn: () => {
    atn.write(DATA, DT);
  },
});
//#endregion
