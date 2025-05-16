import { u8 } from "../primitives/mod.ts";
import {
  type InnerType,
  type Options,
  UnsizedType,
  type ValueOf,
} from "../types/mod.ts";
import { align, alignmentOf } from "../util.ts";

type FindDiscriminant<V, D extends number | string> = (variant: V) => D;

type Keys<T> = Exclude<keyof T, symbol>;

/** Union for when the inner type's don't write their own discriminant */
export class TaggedUnion<
  T extends Record<string | number, UnsizedType<unknown>>,
  V extends ValueOf<{ [K in keyof T]: InnerType<T[K]> }> = ValueOf<
    { [K in keyof T]: InnerType<T[K]> }
  >,
> extends UnsizedType<V> {
  #record: T;
  #variantFinder: FindDiscriminant<V, Keys<T>>;
  #discriminant: UnsizedType<string | number>;

  override maxSize: number | null;

  constructor(
    input: T,
    variantFinder: FindDiscriminant<V, Keys<T>>,
    discriminant: Keys<T> extends string ? UnsizedType<string> : never,
  );

  constructor(
    input: T,
    variantFinder: FindDiscriminant<V, Keys<T>>,
    discriminant?: Keys<T> extends number ? UnsizedType<number> : never,
  );

  constructor(
    input: T,
    variantFinder: FindDiscriminant<V, Keys<T>>,
    discriminant: UnsizedType<string | number> = u8,
  ) {
    super(alignmentOf(input));
    this.#record = input;
    this.#variantFinder = variantFinder;
    this.#discriminant = discriminant;
    this.maxSize = Object.values(input).some((x) => x.maxSize === null)
      ? null
      : Object.values(input).reduce(
        (acc: number, x) =>
          Math.max(acc, align(x.maxSize as number, this.byteAlignment)),
        0,
      );
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): V {
    const discriminant = this.#discriminant.readPacked(dt, options);
    const codec = this.#record[discriminant];
    if (!codec) throw new TypeError("Unknown discriminant");
    return codec.readPacked(dt, options) as V;
  }

  override read(dt: DataView, options: Options = { byteOffset: 0 }): V {
    const discriminant = this.#discriminant.read(dt, options);
    super.alignOffset(options);
    const codec = this.#record[discriminant];
    if (!codec) throw new TypeError("Unknown discriminant");
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

  override write(
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
