import { type Options, UnsizedType } from "../types/mod.ts";

export class ArrayType<T> extends UnsizedType<T[]> {
  override readonly maxSize: number | null;

  constructor(readonly type: UnsizedType<T>, readonly length: number) {
    super(type.byteAlignment);
    this.maxSize = type.maxSize ? type.maxSize * length : null;
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): T[] {
    if (this.length === 0) return [];
    const result = new Array(this.length);
    const { type } = this;

    for (let i = 0; i < result.length; i++) {
      result[i] = type.readPacked(dt, options);
      // No need for the increment offset. This is handled by the `type.readPacked` function
    }

    return result;
  }

  override read(dt: DataView, options: Options = { byteOffset: 0 }): T[] {
    if (this.length === 0) return [];
    const result = new Array(this.length);
    const { type } = this;

    for (let i = 0; i < result.length; i++) {
      result[i] = type.read(dt, options);
      // No need for the increment offset. This is handled by the `type.read` function
    }

    return result;
  }

  writePacked(
    value: T[],
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    if (value.length !== this.length) {
      throw new TypeError("T[].length !== ArrayType<T>.length");
    }

    const { type } = this;
    for (let i = 0; i < value.length; i++) {
      type.writePacked(value[i], dt, options);
      // No need for the increment offset. This is handled by the `type.writePacked` function
    }
  }

  override write(
    value: T[],
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    if (value.length !== this.length) {
      throw new TypeError("T[].length !== ArrayType<T>.length");
    }

    const { type } = this;
    for (let i = 0; i < value.length; i++) {
      type.write(value[i], dt, options);
      // No need for the increment offset. This is handled by the `type.write` function
    }
  }
}
