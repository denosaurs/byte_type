import { SizedType } from "../types.ts";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export class FixedUTF8String implements SizedType<string> {
  byteLength: number;

  constructor(byteLength: number) {
    this.byteLength = byteLength;
  }

  read(dataView: DataView, byteOffset = 0): string {
    return decoder.decode(
      dataView.buffer.slice(byteOffset, byteOffset + this.byteLength),
    );
  }

  write(value: string, dataView: DataView, byteOffset = 0) {
    encoder.encodeInto(
      value,
      new Uint8Array(dataView.buffer, byteOffset, this.byteLength),
    );
  }
}
