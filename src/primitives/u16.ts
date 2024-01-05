import { type Options, SizedType } from "../types/mod.ts";
import { isLittleEndian } from "../util.ts";

export class U16 extends SizedType<number> {
  constructor(readonly littleEndian = isLittleEndian) {
    super(2, 2);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): number {
    super.rangeCheck(dt.byteLength, options.byteOffset);
    const value = dt.getUint16(options.byteOffset, this.littleEndian);
    super.incrementOffset(options);
    return value;
  }

  writePacked(
    value: number,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    super.rangeCheck(dt.byteLength, options.byteOffset);
    dt.setUint16(options.byteOffset, value, this.littleEndian);
    super.incrementOffset(options);
  }
}

export const u16le = new U16(true);
export const u16be = new U16(false);
export const u16 = new U16();
