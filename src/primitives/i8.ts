import { type Options, SizedType } from "../types/mod.ts";

export class I8 extends SizedType<number> {
  constructor() {
    super(1, 1);
  }

  readUnaligned(dt: DataView, options: Options = { byteOffset: 0 }): number {
    super.rangeCheck(dt.byteLength, options.byteOffset);
    const value = dt.getInt8(options.byteOffset);
    super.incrementOffset(options);
    return value;
  }

  writeUnaligned(
    value: number,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    super.rangeCheck(dt.byteLength, options.byteOffset);
    dt.setInt8(options.byteOffset, value);
    super.incrementOffset(options);
  }
}

export const i8 = new I8();
