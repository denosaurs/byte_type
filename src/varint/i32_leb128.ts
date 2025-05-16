import { type Options, UnsizedType } from "../types/mod.ts";
import { CONTINUE_BIT, SEGMENT_BITS } from "./_common.ts";

export class I32Leb128 extends UnsizedType<number> {
  override maxSize = 5;

  constructor() {
    super(1);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): number {
    let value = 0, position = 0;
    while (true) {
      const currentByte = dt.getInt8(options.byteOffset);
      value |= (currentByte & SEGMENT_BITS) << position;

      if ((currentByte & CONTINUE_BIT) === 0) break;

      position += 7;
      options.byteOffset++;

      if (position >= 32) {
        throw new RangeError("I32LEB128 cannot exceed 32 bits in length");
      }
    }

    return value;
  }

  writePacked(
    value: number,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    while (true) {
      if ((value & ~SEGMENT_BITS) === 0) {
        dt.setUint8(options.byteOffset, value);
        return;
      }

      dt.setUint8(options.byteOffset, value & SEGMENT_BITS | CONTINUE_BIT);
      super.incrementOffset(options, 1);
      value >>>= 7;
    }
  }
}

export const i32leb128: I32Leb128 = new I32Leb128();
