import { Type } from "../types.ts";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export class NullTerminatedString implements Type<string> {
  read(dataView: DataView, byteOffset = 0): string {
    let endByteLength;

    for (let i = byteOffset; i < dataView.byteLength; i++) {
      if (dataView.getUint8(i) === 0) {
        endByteLength = i - byteOffset;
        break;
      }
    }

    if (endByteLength == null) {
      throw new TypeError(
        "Did not encounter null terminator when attempting to read null terminated string",
      );
    }

    return decoder.decode(
      new Uint8Array(dataView.buffer, byteOffset, endByteLength),
    );
  }

  write(value: string, dataView: DataView, byteOffset = 0) {
    value += "\0";
    encoder.encodeInto(
      value,
      new Uint8Array(dataView.buffer, byteOffset, value.length),
    );
  }
}

export const nullTerminatedString = new NullTerminatedString();
