import { type Options, SizedType } from "../types/mod.ts";
import { isLittleEndian } from "../util.ts";

export class F32 extends SizedType<number> {
  constructor(readonly littleEndian = isLittleEndian) {
    super(4, 4);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): number {
    super.rangeCheck(dt.byteLength, options.byteOffset);
    const value = dt.getFloat32(options.byteOffset, this.littleEndian);
    super.incrementOffset(options);
    return value;
  }

  writePacked(
    value: number,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    super.rangeCheck(dt.byteLength, options.byteOffset);
    dt.setFloat32(options.byteOffset, value, this.littleEndian);
    super.incrementOffset(options);
  }
}

export const f32le = new F32(true);
export const f32be = new F32(false);
export const f32 = new F32();
