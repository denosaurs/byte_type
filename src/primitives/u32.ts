import { type Options, SizedType } from "../types/mod.ts";
import { isLittleEndian } from "../util.ts";

export class U32 extends SizedType<number> {
  constructor(readonly littleEndian = isLittleEndian) {
    super(4, 4);
  }

  readUnaligned(dt: DataView, options: Options = { byteOffset: 0 }): number {
    const value = dt.getUint32(options.byteOffset, this.littleEndian);
    super.incrementOffset(options);
    return value;
  }

  writeUnaligned(
    value: number,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    dt.setUint32(options.byteOffset, value, this.littleEndian);
    super.incrementOffset(options);
  }
}

export const u32le = new U32(true);
export const u32be = new U32(false);
export const u32 = new U32();
