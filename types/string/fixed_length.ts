import { SizedType } from "../types.ts";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export class FixedLengthString implements SizedType<string> {
  byteLength: number;

  constructor(byteLength: number) {
    this.byteLength = byteLength;
  }

  read(dataView: DataView, byteOffset = 0): string {
    return decoder.decode(
      new Uint8Array(
        dataView.buffer,
        dataView.byteOffset + byteOffset,
        this.byteLength - byteOffset,
      ),
    );
  }

  write(value: string, dataView: DataView, byteOffset = 0) {
    encoder.encodeInto(
      value,
      new Uint8Array(
        dataView.buffer,
        dataView.byteOffset + byteOffset,
        this.byteLength - byteOffset,
      ),
    );
  }
}
