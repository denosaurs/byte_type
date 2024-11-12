import { type Options, SizedType } from "../types/mod.ts";

export class ArrayBufferType extends SizedType<ArrayBuffer> {
  constructor(byteSize: number, byteAlignment = 1) {
    super(byteSize, byteAlignment);
  }

  readPacked(
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): ArrayBuffer {
    const resultAB = new ArrayBuffer(this.byteSize);
    const resultView = new Uint8Array(resultAB);

    resultView.set(
      new Uint8Array(
        dt.buffer,
        dt.byteOffset + options.byteOffset,
        this.byteSize,
      ),
    );

    super.incrementOffset(options);

    return resultAB;
  }

  writePacked(
    value: ArrayBuffer,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    const view = new Uint8Array(
      dt.buffer,
      dt.byteOffset + options.byteOffset,
      this.byteSize,
    );

    view.set(new Uint8Array(value));

    super.incrementOffset(options);
  }
}
