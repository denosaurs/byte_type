import { AlignedType } from "../types.ts";
import { endianess } from "../../utils.ts";

export class U64 implements AlignedType<bigint> {
  byteLength = 8;
  byteAlign = 8;
  endian;

  constructor(endian: boolean = endianess) {
    this.endian = endian;
  }

  read(dataView: DataView, byteOffset = 0): bigint {
    return dataView.getBigUint64(byteOffset, this.endian);
  }

  write(value: bigint, dataView: DataView, byteOffset = 0) {
    dataView.setBigUint64(byteOffset, value, this.endian);
    return dataView.buffer;
  }
}

export const u64 = new U64();
export const u64le = new U64(true);
export const u64be = new U64(false);
