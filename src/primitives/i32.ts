import { type Options, SizedType } from "../types/mod.ts";
import { isLittleEndian } from "../util.ts";

export class I32 extends SizedType<number> {
  constructor(readonly littleEndian: boolean = isLittleEndian) {
    super(4, 4);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): number {
    const value = dt.getInt32(options.byteOffset, this.littleEndian);
    super.incrementOffset(options);
    return value;
  }

  writePacked(
    value: number,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    dt.setInt32(options.byteOffset, value, this.littleEndian);
    super.incrementOffset(options);
  }
}

export const i32le: I32 = new I32(true);
export const i32be: I32 = new I32(false);
export const i32: I32 = new I32();
