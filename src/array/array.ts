import { UnsizedType, type Options } from "../types/mod.ts";

export class ArrayType<T> extends UnsizedType<T[]> {
  constructor(readonly type: UnsizedType<T>, readonly length: number) {
    super(type.byteAlignment);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): T[] {
    if (this.length === 0) return [];
    const result = [];
    result.length = this.length;

    for (let i = 0; i < this.length; i++) {
      result[i] = this.type.readPacked(dt, options);
      // No need for the increment offset. This is handled by the `type.readPacked` function
    }

    return result;
  }

  read(dt: DataView, options: Options = { byteOffset: 0 }): T[] {
    if (this.length === 0) return [];
    const result: unknown[] = [];
    result.length = this.length;

    for (let i = 0; i < this.length; i++) {
      result[i] = this.type.read(dt, options);
      // No need for the increment offset. This is handled by the `type.read` function
    }

    return result as T[];
  }

  writePacked(
    value: T[],
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    if (value.length !== this.length) {
      throw new TypeError("T[].length !== ArrayType<T>.length");
    }
    if (value.length === 0) return;

    for (let i = 0; i < this.length; i++) {
      this.type.writePacked(value[i], dt, options);
      // No need for the increment offset. This is handled by the `type.writePacked` function
    }
  }

  write(
    value: T[],
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    if (value.length !== this.length) {
      throw new TypeError("T[].length !== ArrayType<T>.length");
    }
    if (value.length === 0) return;

    for (let i = 0; i < this.length; i++) {
      this.type.write(value[i], dt, options);
      // No need for the increment offset. This is handled by the `type.write` function
    }
  }
}
