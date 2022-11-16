import { SizedType } from "../types.ts";

export class ArrayBufferLikeType implements SizedType<ArrayBuffer> {
  byteLength: number;

  constructor(byteLength: number) {
    this.byteLength = byteLength;
  }

  read(dataView: DataView, byteOffset = 0): ArrayBuffer {
    return dataView.buffer.slice(byteOffset, byteOffset + this.byteLength);
  }

  write(value: ArrayBuffer, dataView: DataView, byteOffset = 0) {
    new Uint8Array(dataView.buffer, byteOffset, this.byteLength).set(
      new Uint8Array(value, 0, this.byteLength),
    );
  }
}
