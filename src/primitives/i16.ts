import { type Options, SizedType } from "../types/mod.ts";
import { isLittleEndian } from "../util.ts";

export class I16 extends SizedType<number> {
  constructor(readonly littleEndian: boolean = isLittleEndian) {
    super(2, 2);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): number {
    super.rangeCheck(dt.byteLength, options.byteOffset);
    const value = dt.getInt16(options.byteOffset, this.littleEndian);
    super.incrementOffset(options);
    return value;
  }

  writePacked(
    value: number,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    super.rangeCheck(dt.byteLength, options.byteOffset);
    dt.setInt16(options.byteOffset, value, this.littleEndian);
    super.incrementOffset(options);
  }
}

export const i16le: I16 = new I16(true);
export const i16be: I16 = new I16(false);
export const i16: I16 = new I16();
