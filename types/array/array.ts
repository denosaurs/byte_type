import { SizedType } from "../../types.ts";

export class ArrayType<T> implements SizedType<T[]> {
  byteLength: number;
  byteStride: number;
  type: SizedType<T>;

  constructor(
    type: SizedType<T>,
    length: number,
    byteStride: number = type.byteLength,
  ) {
    this.byteLength = length * type.byteLength;
    this.byteStride = byteStride;
    this.type = type;
  }

  read(view: DataView, byteOffset: number): T[] {
    const array = [];

    for (
      let i = byteOffset;
      i < this.byteLength + byteOffset;
      i += this.byteStride
    ) {
      array.push(this.type.read(view, i));
    }

    return array;
  }

  write(view: DataView, byteOffset: number, value: T[]) {
    for (let i = 0; i < value.length; i++) {
      this.type.write(view, byteOffset, value[i]);
      byteOffset += this.byteStride;
    }
  }

  array(view: DataView, byteOffset: number): T[] {
    const array: T[] = [];

    for (
      let i = byteOffset;
      i < this.byteLength + byteOffset;
      i += this.byteStride
    ) {
      Object.defineProperty(array, i, {
        configurable: false,
        enumerable: true,

        get: () => {
          return this.type.read(view, i);
        },
        set: (value: T) => {
          this.type.write(view, i, value);
        },
      });
    }

    return array as T[];
  }
}
