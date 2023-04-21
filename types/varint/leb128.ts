import { Type } from "../types.ts";

const SEGMENT_BITS = 0x7F;
const CONTINUE_BIT = 0x80;

export class I32LEB128 implements Type<number> {
  read(dataView: DataView, byteOffset = 0): number {
    let value = 0, position = 0;
    while (true) {
      const currentByte = dataView.getInt8(byteOffset);
      value |= (currentByte & SEGMENT_BITS) << position;

      if ((currentByte & CONTINUE_BIT) === 0) break;

      position += 7;
      byteOffset++;

      if (position >= 32) {
        throw new TypeError("I32LEB128 cannot exceed 32 bits in length");
      }
    }

    return value;
  }

  write(value: number, dataView: DataView, byteOffset = 0): void {
    while (true) {
      if ((value & ~SEGMENT_BITS) === 0) {
        dataView.setInt8(byteOffset, value);
        return;
      }

      dataView.setInt8(byteOffset, value & SEGMENT_BITS | CONTINUE_BIT);
      byteOffset++;
      value >>>= 7;
    }
  }
}

export const i32leb128 = new I32LEB128();
