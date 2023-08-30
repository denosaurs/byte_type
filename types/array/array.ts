import { SizedType, TypeOptions, ViewableType } from "../types.ts";

export class ArrayType<T> implements SizedType<T[]>, ViewableType<T[]> {
  byteLength: number;
  byteStride: number;
  type: SizedType<T>;

  constructor(
    type: SizedType<T>,
    arrayLength: number,
    byteStride: number = type.byteLength,
  ) {
    this.type = type;
    this.byteStride = byteStride;
    this.byteLength = arrayLength * byteStride;
  }

  read(dataView: DataView, options: TypeOptions = {}): T[] {
    options.byteOffset ??= 0;

    const array = [];
    array.length = this.byteLength / this.byteStride;
    const sliceLength = options.byteOffset + this.byteLength;
    for (
      ;
      options.byteOffset < sliceLength;
      options.byteOffset += this.byteStride
    ) {
      array.push(this.type.read(dataView, options));
    }

    return array;
  }

  write(
    value: T[],
    dataView: DataView,
    options: TypeOptions = {},
  ): void {
    options.byteOffset ??= 0;
    for (let i = 0; i < value.length; i++) {
      this.type.write(value[i], dataView, options);
      options.byteOffset += this.byteStride;
    }
  }

  view(dataView: DataView, options: TypeOptions = {}): T[] {
    options.byteOffset ??= 0;
    const array: T[] = [];
    const sliceLength = options.byteOffset + this.byteLength;

    for (
      let i = 0, offset = options.byteOffset;
      offset < sliceLength;
      i++, offset += this.byteStride
    ) {
      Object.defineProperty(array, i, {
        configurable: false,
        enumerable: true,

        get: () => {
          return this.type.read(dataView, { byteOffset: offset });
        },
        set: (value: T) => {
          this.type.write(value, dataView, { byteOffset: offset });
        },
      });
    }

    return array;
  }
}
