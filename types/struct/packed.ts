import { AlignedType, InnerType, SizedType } from "../types.ts";
import { Struct } from "./mod.ts";

export class PackedStruct<
  T extends Record<string, SizedType<unknown> | AlignedType<unknown>>,
  V extends { [K in keyof T]: InnerType<T[K]> },
> extends Struct<T, V> {
  constructor(types: T, byteAlign: number = 1) {
    const typeRecord: Record<
      string,
      [number, SizedType<unknown> | AlignedType<unknown>]
    > = {};
    let byteLength = 0;

    const typeEntries = Object.entries(types);
    for (let index = 0; index < typeEntries.length; index++) {
      const [key, type] = typeEntries[index];
      typeRecord[key] = [byteLength, type];
      byteLength += type.byteLength;
    }

    super(
      typeRecord as { [K in keyof T]: [number, T[K]] },
      byteLength,
      byteAlign,
    );
  }
}
