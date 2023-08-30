import { AlignedType, TypeOptions } from "../types.ts";
import { endianess } from "../../utils.ts";

export class U128 implements AlignedType<bigint> {
  byteLength = 16;
  byteAlign = 16;
  endian;

  constructor(endian: boolean = endianess) {
    this.endian = endian;
  }

  read(dataView: DataView, options: TypeOptions = {}): bigint {
    options.byteOffset ??= 0;
    const hi = dataView.getBigUint64(options.byteOffset, this.endian);
    const lo = dataView.getBigUint64(options.byteOffset + 8, this.endian);
    return this.endian ? (lo << 64n) | hi : (hi << 64n) | lo;
  }

  write(value: bigint, dataView: DataView, options: TypeOptions = {}) {
    options.byteOffset ??= 0;
    const lo = value & 0xffffffffffffffffn;
    const hi = value >> 64n;
    dataView.setBigUint64(
      options.byteOffset,
      this.endian ? hi : lo,
      this.endian,
    );
    dataView.setBigUint64(
      options.byteOffset + 8,
      this.endian ? lo : hi,
      this.endian,
    );
    return dataView.buffer;
  }
}

export const u128 = new U128();
export const u128le = new U128(true);
export const u128be = new U128(false);
