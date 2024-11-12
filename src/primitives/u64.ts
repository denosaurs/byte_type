import { type Options, SizedType } from "../types/mod.ts";
import { isLittleEndian } from "../util.ts";

export class U64 extends SizedType<bigint> {
  constructor(readonly littleEndian: boolean = isLittleEndian) {
    super(8, 8);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): bigint {
    const value = dt.getBigUint64(options.byteOffset, this.littleEndian);
    super.incrementOffset(options);
    return value;
  }

  writePacked(
    value: bigint,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    dt.setBigUint64(options.byteOffset, value, this.littleEndian);
    super.incrementOffset(options);
  }
}

export const u64le: U64 = new U64(true);
export const u64be: U64 = new U64(false);
export const u64: U64 = new U64();
