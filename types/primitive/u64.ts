import { AlignedType, TypeOptions } from "../types.ts";
import { endianess } from "../../utils.ts";

export class U64 implements AlignedType<bigint> {
  byteLength = 8;
  byteAlign = 8;
  endian;

  constructor(endian: boolean = endianess) {
    this.endian = endian;
  }

  read(dataView: DataView, options: TypeOptions = {}): bigint {
    options.byteOffset ??= 0;
    return dataView.getBigUint64(options.byteOffset, this.endian);
  }

  write(value: bigint, dataView: DataView, options: TypeOptions = {}) {
    options.byteOffset ??= 0;
    dataView.setBigUint64(options.byteOffset, value, this.endian);
    return dataView.buffer;
  }
}

export const u64 = new U64();
export const u64le = new U64(true);
export const u64be = new U64(false);
