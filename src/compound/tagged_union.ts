import { u8 } from "../primitives/mod.ts";
import {
  AlignedType,
  type InnerType,
  type Options,
  type ValueOf,
} from "../types/mod.ts";
import { getBiggestAlignment } from "../util.ts";

type FindDiscriminant<V, D extends number | string> = (variant: V) => D;

type Keys<T> = Exclude<keyof T, symbol>;

export class TaggedUnion<
  T extends Record<string | number, AlignedType<unknown>>,
  V extends ValueOf<{ [K in keyof T]: InnerType<T[K]> }> = ValueOf<
    { [K in keyof T]: InnerType<T[K]> }
  >,
> extends AlignedType<V> {
  #record: T;
  #variantFinder: FindDiscriminant<V, Keys<T>>;
  #discriminant: AlignedType<string | number>;

  constructor(
    input: T,
    variantFinder: FindDiscriminant<V, Keys<T>>,
    discriminant: Keys<T> extends string ? AlignedType<string> : never,
  );

  constructor(
    input: T,
    variantFinder: FindDiscriminant<V, Keys<T>>,
    discriminant?: Keys<T> extends number ? AlignedType<number> : never,
  );

  constructor(
    input: T,
    variantFinder: FindDiscriminant<V, Keys<T>>,
    discriminant: AlignedType<string | number> = u8,
  ) {
    super(getBiggestAlignment(input));
    this.#record = input;
    this.#variantFinder = variantFinder;
    this.#discriminant = discriminant;
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): V {
    const discriminant = this.#discriminant.readPacked(dt, options);
    const codec = this.#record[discriminant];
    if (!codec) throw new TypeError("Unknown discriminant");
    return codec.readPacked(dt, options) as V;
  }

  read(dt: DataView, options: Options = { byteOffset: 0}): V {
    const discriminant = this.#discriminant.read(dt, options);
    const codec = this.#record[discriminant];
    if (!codec)throw new TypeError("Unknown discriminant");
    return codec.read(dt, options) as V;
  }

  writePacked(
    variant: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    const discriminant = this.#variantFinder(variant);
    const codec = this.#record[discriminant];
    if (!codec) throw new TypeError("Unknown discriminant");

    this.#discriminant.writePacked(discriminant, dt, options);
    codec.writePacked(variant, dt, options);
  }

  write(
    variant: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    const discriminant = this.#variantFinder(variant);
    const codec = this.#record[discriminant];
    if (!codec) throw new TypeError("Unknown discriminant");

    this.#discriminant.write(discriminant, dt, options);
    codec.write(variant, dt, options);
  }
}
