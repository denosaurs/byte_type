import { AlignedType, InnerType, SizedType, ViewableType } from "../types.ts";

export class Struct<
  T extends Record<string, SizedType<unknown> | AlignedType<unknown>>,
  V extends { [K in keyof T]: InnerType<T[K]> },
> implements AlignedType<V>, ViewableType<V> {
  byteLength: number;
  byteAlign: number;
  typeRecord: { [K in keyof T]: [number, T[K]] };

  constructor(
    types: { [K in keyof T]: [number, T[K]] },
    byteLength = Math.max(
      ...Object.values(types).map(([byteOffset, type], index, array) =>
        byteOffset + (index === array.length - 1 ? type.byteLength : 0)
      ),
    ),
    byteAlign = Math.max(
      ...Object.values(types).map(([, type]) =>
        "byteAlign" in type ? type.byteAlign : type.byteLength
      ),
    ),
  ) {
    this.typeRecord = types;
    this.byteLength = byteLength;
    this.byteAlign = byteAlign;
  }

  read(dataView: DataView, byteOffset = 0): V {
    const object: Record<string, unknown> = {};

    for (const [key, [typeOffset, type]] of Object.entries(this.typeRecord)) {
      object[key] = type.read(dataView, byteOffset + typeOffset);
    }

    return object as V;
  }

  write(value: V, dataView: DataView, byteOffset = 0) {
    for (const [key, [typeOffset, type]] of Object.entries(this.typeRecord)) {
      type.write(value[key], dataView, byteOffset + typeOffset);
    }
  }

  view(dataView: DataView, byteOffset = 0): V {
    const object = {};

    Object.defineProperties(
      object,
      Object.fromEntries(
        Object.keys(this.typeRecord).map(
          (key) => {
            const [typeOffset, type] = this.typeRecord[key];

            return [key, {
              configurable: false,
              enumerable: true,

              get: () => {
                return type.read(dataView, byteOffset + typeOffset);
              },
              set: (value) => {
                type.write(value, dataView, byteOffset + typeOffset);
              },
            }];
          },
        ),
      ),
    );

    return object as V;
  }
}
