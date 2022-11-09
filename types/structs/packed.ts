import { AlignedType, InnerType, SizedType } from "../../types.ts";
import { StructType } from "./mod.ts";

import { u16, u32, u8 } from "../primitives/mod.ts";

export class AlignedStruct<
  T extends Record<string, SizedType<unknown> | AlignedType<unknown>>,
  V extends { [K in keyof T]: InnerType<T[K]> },
> extends StructType<T, V> {
  byteLength: number;
  byteAlign: number;
  typeRecord: Record<
    string,
    [number, SizedType<unknown> | AlignedType<unknown>]
  >;

  constructor(
    types: T,
    byteAlign: number = Math.max(
      ...Object.values(types).map((type) =>
        "byteAlign" in type ? type.byteAlign : type.byteLength
      ),
    ),
  ) {
    super();

    this.typeRecord = {};
    this.byteLength = 0;
    this.byteAlign = byteAlign;

    const typeEntries = Object.entries(types);
    for (let index = 0; index < typeEntries.length; index++) {
      const [key, type] = typeEntries[index];
      const typeAlign = "byteAlign" in type ? type.byteAlign : type.byteLength;
      const typePadding = (typeAlign - (this.byteLength % typeAlign)) %
        typeAlign;
      const typeOffset = this.byteLength + typePadding;

      this.typeRecord[key] = [typeOffset, type];
      this.byteLength = typeOffset + type.byteLength;
    }

    this.byteLength = this.byteLength +
      (this.byteAlign - (this.byteLength % this.byteAlign)) % this.byteAlign;
  }
}

export class PackedStruct<
  T extends Record<string, SizedType<unknown> | AlignedType<unknown>>,
  V extends { [K in keyof T]: InnerType<T[K]> },
> extends StructType<T, V> {
  byteLength: number;
  byteAlign = 1;
  typeRecord: Record<
    string,
    [number, SizedType<unknown> | AlignedType<unknown>]
  >;

  constructor(types: T) {
    super();

    this.typeRecord = {};
    this.byteLength = 0;

    const typeEntries = Object.entries(types);
    for (let index = 0; index < typeEntries.length; index++) {
      const [key, type] = typeEntries[index];
      this.typeRecord[key] = [this.byteLength, type];
      this.byteLength += type.byteLength;
    }
  }
}

const o = new PackedStruct({ "b": u8, "a": u32 }).object(
  new DataView(new ArrayBuffer(5)),
  0,
);

console.log(o.valueOf());
