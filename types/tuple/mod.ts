import { InnerType, SizedType, TypeOptions, ViewableType } from "../types.ts";

export class Tuple<
  T extends [...SizedType<unknown>[]],
  V extends [...unknown[]] = { [I in keyof T]: InnerType<T[I]> },
> implements SizedType<V>, ViewableType<V> {
  byteLength: number;
  typeOffsets: [number, SizedType<unknown>][];

  constructor(types: T) {
    this.byteLength = 0;
    this.typeOffsets = types.map((type) => {
      const typeOffset: [number, SizedType<unknown>] = [this.byteLength, type];
      this.byteLength += type.byteLength;
      return typeOffset;
    });

    for (const type of types) {
      this.byteLength += type.byteLength;
    }
  }

  read(dataView: DataView, options: TypeOptions = {}): V {
    options.byteOffset ??= 0;
    const len = this.typeOffsets.length;

    const tuple = new Array(len);
    for (let i = 0; i < len; i++) {
      const [typeOffset, type] = this.typeOffsets[i];
      options.byteOffset += typeOffset;
      tuple[i] = type.read(dataView, options);
    }
    return tuple as V;
  }

  write(value: V, dataView: DataView, options: TypeOptions = {}) {
    options.byteOffset ??= 0;
    const len = this.typeOffsets.length;
    for (let i = 0; i < len; i++) {
      const [typeOffset, type] = this.typeOffsets[i];
      options.byteOffset += typeOffset;
      type.write(value[i], dataView, options);
    }
  }

  view(dataView: DataView, options: TypeOptions = {}): V {
    options.byteOffset ??= 0;
    const tuple: unknown[] = [];

    for (
      let i = 0;
      i < this.typeOffsets.length;
      i++
    ) {
      const [typeOffset, type] = this.typeOffsets[i];

      Object.defineProperty(tuple, i, {
        configurable: false,
        enumerable: true,

        get: () => {
          return type.read(dataView, {
            byteOffset: options.byteOffset! + typeOffset,
          });
        },
        set: (value: T) => {
          type.write(value, dataView, {
            byteOffset: options.byteOffset! + typeOffset,
          });
        },
      });
    }

    return tuple as V;
  }
}
