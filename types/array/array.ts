import { SizedType, ViewableType } from "../types.ts";

export class ArrayType<T> implements SizedType<T[]>, ViewableType<T[]> {
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

  read(dataView: DataView, byteOffset = 0): T[] {
    const array = [];

    for (
      let i = byteOffset;
      i < this.byteLength + byteOffset;
      i += this.byteStride
    ) {
      array.push(this.type.read(dataView, i));
    }

    return array;
  }

  write(value: T[], dataView: DataView, byteOffset = 0) {
    for (let i = 0; i < value.length; i++) {
      this.type.write(value[i], dataView, byteOffset);
      byteOffset += this.byteStride;
    }
  }

  view(dataView: DataView, byteOffset = 0): T[] {
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
          return this.type.read(dataView, i);
        },
        set: (value: T) => {
          this.type.write(value, dataView, i);
        },
      });
    }

    return array as T[];
  }
}
