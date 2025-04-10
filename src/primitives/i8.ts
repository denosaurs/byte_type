import { type Options, SizedType } from "../types/mod.ts";

export class I8 extends SizedType<number> {
  constructor() {
    super(1, 1);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): number {
    const value = dt.getInt8(options.byteOffset);
    super.incrementOffset(options);
    return value;
  }

  writePacked(
    value: number,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    dt.setInt8(options.byteOffset, value);
    super.incrementOffset(options);
  }
}

export const i8: I8 = new I8();
