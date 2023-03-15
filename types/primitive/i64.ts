import { AlignedType } from "../types.ts";
import { endianess } from "../../utils.ts";

export class I64 implements AlignedType<bigint> {
  byteLength = 8;
  byteAlign = 8;
  endian;

  constructor(endian: boolean = endianess) {
    this.endian = endian;
  }

  read(dataView: DataView, byteOffset = 0): bigint {
    return dataView.getBigInt64(byteOffset, this.endian);
  }

  write(value: bigint, dataView: DataView, byteOffset = 0) {
    dataView.setBigInt64(byteOffset, value, this.endian);
    return dataView.buffer;
  }
}

export const i64 = new I64();
export const i64le = new I64(true);
export const i64be = new I64(false);
