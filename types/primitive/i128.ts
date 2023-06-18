import { AlignedType } from "../types.ts";
import { endianess } from "../../utils.ts";

export class I128 implements AlignedType<bigint> {
  byteLength = 16;
  byteAlign = 8;
  endian;

  constructor(endian: boolean = endianess) {
    this.endian = endian;
  }

  read(dataView: DataView, byteOffset = 0): bigint {
    const hi = dataView.getBigInt64(byteOffset, this.endian);
    const lo = dataView.getBigInt64(byteOffset + 8, this.endian);
    return this.endian ? (lo << 64n) | hi : (hi << 64n) | lo;
  }

  write(value: bigint, dataView: DataView, byteOffset = 0) {
    const lo = value & 0xffffffffffffffffn;
    const hi = value >> 64n;
    dataView.setBigInt64(byteOffset, this.endian ? hi : lo, this.endian);
    dataView.setBigInt64(byteOffset + 8, this.endian ? lo : hi, this.endian);
    return dataView.buffer;
  }
}

export const i128 = new I128();
export const i128le = new I128(true);
export const i128be = new I128(false);
