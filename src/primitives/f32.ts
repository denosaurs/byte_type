import { type Options, SizedType } from "../types/mod.ts";
import { isLittleEndian } from "../util.ts";

export class F32 extends SizedType<number> {
  constructor(readonly littleEndian: boolean = isLittleEndian) {
    super(4, 4);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): number {
    const value = dt.getFloat32(options.byteOffset, this.littleEndian);
    super.incrementOffset(options);
    return value;
  }

  writePacked(
    value: number,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    dt.setFloat32(options.byteOffset, value, this.littleEndian);
    super.incrementOffset(options);
  }
}

export const f32le: F32 = new F32(true);
export const f32be: F32 = new F32(false);
export const f32: F32 = new F32();
