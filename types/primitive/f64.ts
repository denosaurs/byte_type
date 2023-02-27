import { AlignedType } from "../types.ts";
import { endianess } from "../../util.ts";

export class F64 implements AlignedType<number> {
  byteLength = 8;
  byteAlign = 8;
  endian;

  constructor(endian: boolean = endianess) {
    this.endian = endian;
  }

  read(dataView: DataView, byteOffset = 0): number {
    return dataView.getFloat64(byteOffset, this.endian);
  }

  write(value: number, dataView: DataView, byteOffset = 0) {
    dataView.setFloat64(byteOffset, value, this.endian);
    return dataView.buffer;
  }
}

export const f64 = new F64();
export const f64le = new F64(true);
export const f64be = new F64(false);
