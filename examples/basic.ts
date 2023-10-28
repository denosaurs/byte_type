import { Struct, u32, u8 } from "../src/mod.ts";

const buffer = new ArrayBuffer(8);
const dt = new DataView(buffer);

const o = new Struct({ "b": u8, "a": u32 });

o.write({ b: 8, a: 32 }, dt);
console.log(o.read(dt));
