import { type Options, SizedType } from "../types/mod.ts";

export class Bool extends SizedType<boolean> {
  constructor() {
    super(1, 1);
  }

  readUnaligned(dt: DataView, options: Options = { byteOffset: 0 }): boolean {
    super.rangeCheck(dt.byteLength, options.byteOffset);

    const value = !!dt.getInt8(options.byteOffset);
    super.incrementOffset(options);
    return value;
  }

  writeUnaligned(
    value: boolean,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    super.rangeCheck(dt.byteLength, options.byteOffset);

    dt.setInt8(options.byteOffset, Number(value));
    super.incrementOffset(options);
  }
}

export const bool = new Bool();
