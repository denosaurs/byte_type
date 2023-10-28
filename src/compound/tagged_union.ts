import { u8 } from "../primitives/mod.ts";
import {
  AlignedType,
  type InnerType,
  type Options,
  type Packed,
  type ValueOf,
} from "../types/mod.ts";

type Fn<T> = (value: T) => number;

export class TaggedUnion<
  T extends Record<number, AlignedType<unknown>>,
  V extends ValueOf<{ [K in keyof T]: InnerType<T[K]> }> = ValueOf<
    { [K in keyof T]: InnerType<T[K]> }
  >,
> extends AlignedType<V> implements Packed<V> {
  #record: T;
  #variantFinder: Fn<V>;

  constructor(input: T, variantFinder: Fn<V>) {
    // Find biggest alignment
    const byteAlignment = Object.values(input)
      .reduce((acc, x) => Math.max(acc, x.byteAlignment), 0);
    super(byteAlignment);
    this.#record = input;
    this.#variantFinder = variantFinder;
  }

  readUnaligned(dt: DataView, options: Options = { byteOffset: 0 }): V {
    const discriminant = u8.readUnaligned(dt, options);
    const codec = this.#record[discriminant];
    if (!codec) throw new Error("Unknown discriminant");
    return codec.read(dt, options) as V;
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): V {
    const discriminant = u8.readUnaligned(dt, options);
    const codec = this.#record[discriminant];
    if (!codec) throw new Error("Unknown discriminant");
    return codec.readUnaligned(dt, options) as V;
  }

  writeUnaligned(
    variant: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    const discriminant = this.#variantFinder(variant);
    const codec = this.#record[discriminant];
    if (!codec) throw new Error("Unknown discriminant");

    u8.writeUnaligned(discriminant, dt, options);
    codec.write(variant, dt, options);
  }

  writePacked(
    variant: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    const discriminant = this.#variantFinder(variant);
    const codec = this.#record[discriminant];
    if (!codec) throw new Error("Unknown discriminant");

    u8.writeUnaligned(discriminant, dt, options);
    codec.writeUnaligned(variant, dt, options);
  }
}
