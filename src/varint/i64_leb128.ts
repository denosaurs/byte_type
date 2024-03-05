import { type Options, UnsizedType } from "../types/mod.ts";
import { CONTINUE_BIT, SEGMENT_BITS } from "./_common.ts";

const SEGMENT_BITS_N = BigInt(SEGMENT_BITS);
const CONTINUE_BIT_N = BigInt(CONTINUE_BIT);

const AB = new ArrayBuffer(8);
const U32_VIEW = new Uint32Array(AB);
const I64_VIEW = new BigInt64Array(AB);
const U64_VIEW = new BigUint64Array(AB);

export class I64Leb128 extends UnsizedType<bigint> {
  constructor() {
    super(1);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): bigint {
    // Copyright 2023 the Blocktopus authors. All rights reserved. MIT license.
    // Modified to use a `DataView` instead of a `Uint8Array` and to return i64 instead of u64

    U64_VIEW[0] = 0n;
    let intermediate = 0;
    let position = 0;
    let i = 0;

    let byte = dt.getUint8(options.byteOffset);
    do {
      byte = dt.getUint8(options.byteOffset);

      // 1. Take the lower 7 bits of the byte.
      // 2. Shift the bits into the correct position.
      // 3. Bitwise OR it with the intermediate value
      // QUIRK: in the 5th (and 10th) iteration of this loop it will overflow on the shift.
      // This causes only the lower 4 bits to be shifted into place and removing the upper 3 bits
      intermediate |= (byte & 0b01111111) << position;

      if (position === 28) {
        // Write to the view
        U32_VIEW[0] = intermediate;
        // set `intermediate` to the remaining 3 bits
        // We only want the remaining three bits because the other 4 have been "consumed" on line 21
        intermediate = (byte & 0b01110000) >>> 4;
        // set `position` to -4 because later 7 will be added, making it 3
        position = -4;
      }

      position += 7;
      i++;
      super.incrementOffset(options, 1);
      // Keep going while there is a continuation bit
    } while ((byte & CONTINUE_BIT) === CONTINUE_BIT);

    if (i === 11 && intermediate > -1) {
      throw new RangeError("Maximum size reached");
    }

    // Write the intermediate value to the "empty" slot
    // if the first slot is taken. Take the second slot
    U32_VIEW[Number(i > 4)] = intermediate;

    // Cast the two u32's to a i64 bigint
    return I64_VIEW[0];
  }

  writePacked(
    value: bigint,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    I64_VIEW[0] = value;
    value = U64_VIEW[0];

    while (true) {
      if (Number(value & CONTINUE_BIT_N) === 0) {
        dt.setUint8(options.byteOffset, Number(value));
        super.incrementOffset(options, 1);
        return;
      }

      dt.setUint8(
        options.byteOffset,
        Number(value & SEGMENT_BITS_N) | CONTINUE_BIT,
      );
      super.incrementOffset(options, 1);
      value >>= 7n;
    }
  }
}

export const i64leb128: I64Leb128 = new I64Leb128();
