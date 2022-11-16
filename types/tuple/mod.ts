import { InnerType, SizedType, ViewableType } from "../types.ts";

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

  read(dataView: DataView, byteOffset = 0): V {
    const tuple = [];

    for (const [typeOffset, type] of this.typeOffsets) {
      tuple.push(type.read(dataView, byteOffset + typeOffset));
    }

    return tuple as V;
  }

  write(value: V, dataView: DataView, byteOffset = 0) {
    let i = 0;
    for (const [typeOffset, type] of this.typeOffsets) {
      type.write(value[i++], dataView, byteOffset + typeOffset);
    }
  }

  view(dataView: DataView, byteOffset = 0): V {
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
          return type.read(dataView, byteOffset + typeOffset);
        },
        set: (value: T) => {
          type.write(value, dataView, byteOffset + typeOffset);
        },
      });
    }

    return tuple as V;
  }
}