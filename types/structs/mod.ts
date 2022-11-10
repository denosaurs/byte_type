import { AlignedType, InnerType, SizedType } from "../../types.ts";

export class Struct<
  T extends Record<string, SizedType<unknown> | AlignedType<unknown>>,
  V extends { [K in keyof T]: InnerType<T[K]> },
> implements AlignedType<V> {
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

  read(view: DataView, byteOffset: number): V {
    const object: Record<string, unknown> = {};

    for (const [key, [typeOffset, type]] of Object.entries(this.typeRecord)) {
      object[key] = type.read(view, byteOffset + typeOffset);
    }

    return object as V;
  }

  write(view: DataView, byteOffset: number, value: V) {
    for (const [key, [typeOffset, type]] of Object.entries(this.typeRecord)) {
      type.write(view, byteOffset + typeOffset, value[key]);
    }
  }

  object(view: DataView, byteOffset: number): V {
    const object = {};

    Object.defineProperties(
      object,
      Object.fromEntries(
        Object.keys(this.typeRecord).map(
          (key) => {
            return [key, {
              configurable: false,
              enumerable: true,

              get: () => {
                const [typeOffset, type] = this.typeRecord[key];
                return type.read(view, byteOffset + typeOffset);
              },
              set: (value) => {
                const [typeOffset, type] = this.typeRecord[key];
                type.write(view, byteOffset + typeOffset, value);
              },
            }];
          },
        ),
      ),
    );

    return object as V;
  }
}

export * from "./packed.ts";
