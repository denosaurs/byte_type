import { type Options, SizedType } from "../types/mod.ts";
import { isLittleEndian } from "../util.ts";

export class U32 extends SizedType<number> {
  constructor(readonly littleEndian: boolean = isLittleEndian) {
    super(4, 4);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): number {
    const value = dt.getUint32(options.byteOffset, this.littleEndian);
    super.incrementOffset(options);
    return value;
  }

  writePacked(
    value: number,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    dt.setUint32(options.byteOffset, value, this.littleEndian);
    super.incrementOffset(options);
  }
}

export const u32le: U32 = new U32(true);
export const u32be: U32 = new U32(false);
export const u32: U32 = new U32();
