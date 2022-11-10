import { SizedType } from "../../types.ts";

export class ArrayBufferLikeType implements SizedType<ArrayBuffer> {
  byteLength: number;

  constructor(byteLength: number) {
    this.byteLength = byteLength;
  }

  read(view: DataView, byteOffset: number): ArrayBuffer {
    return view.buffer.slice(byteOffset, byteOffset + this.byteLength);
  }

  write(view: DataView, byteOffset: number, value: ArrayBuffer) {
    new Uint8Array(view.buffer, byteOffset, this.byteLength).set(
      new Uint8Array(value, 0, this.byteLength),
    );
  }
}
