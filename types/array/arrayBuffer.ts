import { SizedType, TypeOptions } from "../types.ts";

export class ArrayBufferType implements SizedType<ArrayBuffer> {
  byteLength: number;

  constructor(byteLength: number) {
    this.byteLength = byteLength;
  }

  read(dataView: DataView, options: TypeOptions = {}): ArrayBuffer {
    options.byteOffset ??= 0;
    return dataView.buffer.slice(
      options.byteOffset,
      options.byteOffset + this.byteLength,
    );
  }

  write(value: ArrayBuffer, dataView: DataView, options: TypeOptions = {}) {
    options.byteOffset ??= 0;
    new Uint8Array(dataView.buffer, options.byteOffset, this.byteLength).set(
      new Uint8Array(value, 0, this.byteLength),
    );
  }
}
