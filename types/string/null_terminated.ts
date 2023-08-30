import { Type, TypeOptions } from "../types.ts";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export class NullTerminatedString implements Type<string> {
  read(dataView: DataView, options: TypeOptions = {}): string {
    options.byteOffset ??= 0;
    let endByteLength = null;
    for (let i = options.byteOffset; i < dataView.byteLength; i++) {
      if (dataView.getUint8(i) === 0) {
        endByteLength = i - options.byteOffset;
        break;
      }
    }

    if (endByteLength == null) {
      throw new TypeError(
        "Did not encounter null terminator when attempting to read null terminated string",
      );
    }

    return decoder.decode(
      new Uint8Array(dataView.buffer, options.byteOffset, endByteLength),
    );
  }

  write(value: string, dataView: DataView, options: TypeOptions = {}) {
    options.byteOffset ??= 0;
    value += "\0";
    encoder.encodeInto(
      value,
      new Uint8Array(dataView.buffer, options.byteOffset, value.length),
    );
  }
}

export const nullTerminatedString = new NullTerminatedString();
