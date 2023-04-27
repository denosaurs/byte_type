import type { ReadOptions, Type, WriteOptions } from "../types.ts";

const SEGMENT_BITS = 0x7f;
const CONTINUE_BIT = 0x80;

export class I32LEB128 implements Type<number> {
  read(dataView: DataView, options?: ReadOptions): number {
    options ??= {};
    options.byteOffset ??= 0;

    let value = 0,
      position = 0;
    while (true) {
      const currentByte = dataView.getInt8(options.byteOffset);
      value |= (currentByte & SEGMENT_BITS) << position;

      if ((currentByte & CONTINUE_BIT) === 0) break;

      position += 7;
      options.byteOffset++;

      if (position >= 32) {
        throw new RangeError("I32LEB128 cannot exceed 32 bits in length");
      }
    }

    options.byteOffset++;

    return value;
  }

  write(value: number, dataView: DataView, options?: WriteOptions): void {
    options ??= {};
    options.byteOffset ??= 0;

    while (true) {
      if ((value & ~SEGMENT_BITS) === 0) {
        dataView.setInt8(options.byteOffset, value);
        options.byteOffset++;
        return;
      }

      dataView.setInt8(
        options.byteOffset,
        (value & SEGMENT_BITS) | CONTINUE_BIT,
      );
      options.byteOffset++;
      value >>>= 7;
    }
  }
}

export const i32leb128 = new I32LEB128();
