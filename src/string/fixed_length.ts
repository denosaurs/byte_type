import { type Options, SizedType } from "../types/mod.ts";
import { TEXT_DECODER, TEXT_ENCODER } from "./_common.ts";

export class FixedLength extends SizedType<string> {
  constructor(length: number, byteAlignment = 1) {
    super(length, byteAlignment);
  }

  readUnaligned(dt: DataView, options: Options = { byteOffset: 0 }): string {
    super.rangeCheck(dt.byteLength, options.byteOffset);

    const view = new Uint8Array(
      dt.buffer,
      dt.byteOffset + options.byteOffset,
      this.byteSize,
    );
    const value = TEXT_DECODER.decode(view);
    super.incrementOffset(options);
    return value;
  }

  /** if `value.length` is bigger than the allowed length it will be truncated */
  writeUnaligned(
    value: string,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    super.rangeCheck(dt.byteLength, options.byteOffset);

    const view = new Uint8Array(
      dt.buffer,
      dt.byteOffset + options.byteOffset,
      this.byteSize,
    );

    TEXT_ENCODER.encodeInto(value, view);
    super.incrementOffset(options);
  }
}

export const asciiChar = new FixedLength(1);
export const utf8Char = new FixedLength(4);
