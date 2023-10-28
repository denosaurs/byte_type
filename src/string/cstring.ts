import { type Options, UnsizedType } from "../types/mod.ts";
import { TEXT_DECODER, TEXT_ENCODER } from "./_common.ts";

export class CString extends UnsizedType<string> {
  constructor() {
    super();
  }

  readUnaligned(dt: DataView, options: Options = { byteOffset: 0 }): string {
    const view = new Uint8Array(dt.buffer, dt.byteOffset + options.byteOffset);
    let i = 0;
    while (view[i] !== 0x00) {
      i++;
    }

    const value = TEXT_DECODER.decode(view.subarray(0, i));
    // increment offset by `i + 1` because of the `null` at the end of the string
    super.incrementOffset(options, i + 1);
    return value;
  }

  /** `value` should not be a cstring. `\0` get's appended automatically */
  writeUnaligned(
    value: string,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    const view = new Uint8Array(dt.buffer, dt.byteOffset + options.byteOffset);

    const paddedValue = value + "\0";

    TEXT_ENCODER.encodeInto(paddedValue, view);

    super.incrementOffset(options, paddedValue.length);
  }
}

export const cstring = new CString();
