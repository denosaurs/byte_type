import { type Options, SizedType } from "../types/mod.ts";
import { isLittleEndian } from "../util.ts";

export class F64 extends SizedType<number> {
  constructor(readonly littleEndian: boolean = isLittleEndian) {
    super(8, 8);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): number {
    const value = dt.getFloat64(options.byteOffset, this.littleEndian);
    super.incrementOffset(options);
    return value;
  }

  writePacked(
    value: number,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    dt.setFloat64(options.byteOffset, value, this.littleEndian);
    super.incrementOffset(options);
  }
}

export const f64le: F64 = new F64(true);
export const f64be: F64 = new F64(false);
export const f64: F64 = new F64();
