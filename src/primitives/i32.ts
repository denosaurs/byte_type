import { type Options, SizedType } from "../types/mod.ts";
import { isLittleEndian } from "../util.ts";

export class I32 extends SizedType<number> {
  constructor(readonly littleEndian = isLittleEndian) {
    super(4, 4);
  }

  readUnaligned(dt: DataView, options: Options = { byteOffset: 0 }): number {
    super.rangeCheck(dt.byteLength, options.byteOffset);
    const value = dt.getInt32(options.byteOffset, this.littleEndian);
    super.incrementOffset(options);
    return value;
  }

  writeUnaligned(
    value: number,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    super.rangeCheck(dt.byteLength, options.byteOffset);
    dt.setInt32(options.byteOffset, value, this.littleEndian);
    super.incrementOffset(options);
  }
}

export const i32le = new I32(true);
export const i32be = new I32(false);
export const i32 = new I32();
