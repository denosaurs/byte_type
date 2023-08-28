import {
  AlignedType,
  InnerType,
  SizedType,
  TypeOptions,
  ViewableType,
} from "../types.ts";

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

  read(dataView: DataView, options: TypeOptions = {}): V {
    options.byteOffset ??= 0;
    const keys = Object.keys(this.typeRecord);
    const len = keys.length;
    const object = {} as V;

    for (let i = 0; i < len; i++) {
      const k = keys[i];
      const [offset, type] = this.typeRecord[k];
      options.byteOffset += offset;
      object[k as keyof V] = type.read(
        dataView,
        options,
      ) as V[keyof V];
    }

    return object;
  }

  write(value: V, dataView: DataView, options: TypeOptions = {}) {
    options.byteOffset ??= 0;
    const keys = Object.keys(this.typeRecord);
    const len = keys.length;
    for (let i = 0; i < len; i++) {
      const key = keys[i];
      const [offset, type] = this.typeRecord[key];
      options.byteOffset += +offset;
      type.write(value[key], dataView, options);
    }
  }

  view(dataView: DataView, options: TypeOptions = {}): V {
    options.byteOffset ??= 0;
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
                return type.read(dataView, {
                  byteOffset: options.byteOffset! + typeOffset,
                });
              },
              set: (value) => {
                type.write(value, dataView, {
                  byteOffset: options.byteOffset! + typeOffset,
                });
              },
            }];
          },
        ),
      ),
    );

    return object as V;
  }
}
