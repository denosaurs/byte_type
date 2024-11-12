import { type Options, SizedType } from "../types/mod.ts";
import { isLittleEndian } from "../util.ts";

export class I64 extends SizedType<bigint> {
  constructor(readonly littleEndian: boolean = isLittleEndian) {
    super(8, 8);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): bigint {
    const value = dt.getBigInt64(options.byteOffset, this.littleEndian);
    super.incrementOffset(options);
    return value;
  }

  writePacked(
    value: bigint,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    dt.setBigInt64(options.byteOffset, value, this.littleEndian);
    super.incrementOffset(options);
  }
}

export const i64le: I64 = new I64(true);
export const i64be: I64 = new I64(false);
export const i64: I64 = new I64();
