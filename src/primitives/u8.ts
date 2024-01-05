import { type Options, SizedType } from "../types/mod.ts";

export class U8 extends SizedType<number> {
  constructor() {
    super(1, 1);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): number {
    super.rangeCheck(dt.byteLength, options.byteOffset);
    const value = dt.getUint8(options.byteOffset);
    super.incrementOffset(options);
    return value;
  }

  writePacked(
    value: number,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    super.rangeCheck(dt.byteLength, options.byteOffset);
    dt.setUint8(options.byteOffset, value);
    super.incrementOffset(options);
  }
}

export const u8 = new U8();
