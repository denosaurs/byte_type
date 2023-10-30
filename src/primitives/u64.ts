import { type Options, SizedType } from "../types/mod.ts";
import { isLittleEndian } from "../util.ts";

export class U64 extends SizedType<bigint> {
  constructor(readonly littleEndian = isLittleEndian) {
    super(8, 8);
  }

  readUnaligned(dt: DataView, options: Options = { byteOffset: 0 }): bigint {
    super.rangeCheck(dt.byteLength, options.byteOffset);
    const value = dt.getBigUint64(options.byteOffset, this.littleEndian);
    super.incrementOffset(options);
    return value;
  }

  writeUnaligned(
    value: bigint,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    super.rangeCheck(dt.byteLength, options.byteOffset);
    dt.setBigUint64(options.byteOffset, value, this.littleEndian);
    super.incrementOffset(options);
  }
}

export const u64le = new U64(true);
export const u64be = new U64(false);
export const u64 = new U64();
