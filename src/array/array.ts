import { AlignedType, type Options, type Packed } from "../types/mod.ts";

export class ArrayType<T> extends AlignedType<T[]> implements Packed<T[]> {
  constructor(readonly type: AlignedType<T>, readonly length: number) {
    super(type.byteAlignment);
  }

  readUnaligned(dt: DataView, options: Options = { byteOffset: 0 }): T[] {
    const result = [];
    result.length = this.length;
    result[0] = this.type.readUnaligned(dt, options);

    for (let i = 1; i < this.length; i++) {
      result[i] = this.type.read(dt, options);
      // No need for the increment offset. This is handled by the `type.read` function
    }

    return result;
  }

  readPacked(dt: DataView, options?: Options | undefined): T[] {
    const result = [];
    result.length = this.length;

    for (let i = 0; i < this.length; i++) {
      result[i] = this.type.readUnaligned(dt, options);
      // No need for the increment offset. This is handled by the `type.readUnaligned` function
    }

    return result;
  }

  writeUnaligned(
    value: T[],
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    if (value.length !== this.length) {
      throw new TypeError("`T[].length !== ArrayType<T>.length`");
    }

    this.type.writeUnaligned(value[0], dt, options);

    for (let i = 1; i < this.length; i++) {
      this.type.write(value[i], dt, options);
      // No need for the increment offset. This is handled by the `type.write` function
    }
  }

  writePacked(
    value: T[],
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    if (value.length !== this.length) {
      throw new TypeError("`T[].length !== ArrayType<T>.length`");
    }

    for (let i = 0; i < this.length; i++) {
      this.type.writeUnaligned(value[i], dt, options);
      // No need for the increment offset. This is handled by the `type.writeUnaligned` function
    }
  }
}
