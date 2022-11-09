import { AlignedType, InnerType, SizedType } from "../../types.ts";

export abstract class StructType<
  T extends Record<string, SizedType<unknown> | AlignedType<unknown>>,
  V extends { [K in keyof T]: InnerType<T[K]> },
> implements AlignedType<V> {
  abstract byteLength: number;
  abstract byteAlign: number;
  abstract typeRecord: Record<
    string,
    [number, SizedType<unknown> | AlignedType<unknown>]
  >;

  read(view: DataView, offset: number): V {
    const object: Record<string, unknown> = {};

    for (const [key, [typeOffset, type]] of Object.entries(this.typeRecord)) {
      object[key] = type.read(view, offset + typeOffset);
    }

    return object as V;
  }

  write(view: DataView, offset: number, value: V) {
    for (const [key, [typeOffset, type]] of Object.entries(this.typeRecord)) {
      type.write(view, offset + typeOffset, value[key]);
    }
  }

  object(view: DataView, offset: number): V {
    const object = {};

    Object.defineProperties(
      object,
      Object.fromEntries(
        Object.keys(this.typeRecord).map(
          (key) => {
            return [key, {
              configurable: true,
              enumerable: true,

              get: () => {
                const [typeOffset, type] = this.typeRecord[key];
                return type.read(view, offset + typeOffset);
              },
              set: (value) => {
                const [typeOffset, type] = this.typeRecord[key];
                type.write(view, offset + typeOffset, value);
              },
            }];
          },
        ),
      ),
    );

    return object as V;
  }
}
