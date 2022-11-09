import { AlignedType, InnerType, SizedType } from "../../types.ts";
import { Struct } from "./mod.ts";

export class AlignedStruct<
  T extends Record<string, SizedType<unknown> | AlignedType<unknown>>,
  V extends { [K in keyof T]: InnerType<T[K]> },
> extends Struct<T, V> {
  constructor(
    types: T,
    byteAlign: number = Math.max(
      ...Object.values(types).map((type) =>
        "byteAlign" in type ? type.byteAlign : type.byteLength
      ),
    ),
  ) {
    const typeRecord: Record<
      string,
      [number, SizedType<unknown> | AlignedType<unknown>]
    > = {};
    let byteLength = 0;

    const typeEntries = Object.entries(types);
    for (let index = 0; index < typeEntries.length; index++) {
      const [key, type] = typeEntries[index];
      const typeAlign = "byteAlign" in type ? type.byteAlign : type.byteLength;
      const typePadding = (typeAlign - (byteLength % typeAlign)) %
        typeAlign;
      const typeOffset = byteLength + typePadding;

      typeRecord[key] = [typeOffset, type];
      byteLength = typeOffset + type.byteLength;
    }

    byteLength = byteLength +
      (byteAlign - (byteLength % byteAlign)) % byteAlign;

    super(
      typeRecord as { [K in keyof T]: [number, T[K]] },
      byteLength,
      byteAlign,
    );
  }
}
