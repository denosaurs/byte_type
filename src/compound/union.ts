import { u8 } from "../primitives/mod.ts";
import {
  type InnerType,
  type Options,
  UnsizedType,
  type ValueOf,
} from "../types/mod.ts";
import { alignmentOf } from "../util.ts";

type FindDiscriminant<V, D extends number> = (variant: V) => D;

type Keys<T> = Exclude<keyof T, symbol | string>;

/** Union for when the inner type's do write their own discriminant */
export class Union<
  T extends Record<number, UnsizedType<unknown>>,
  V extends ValueOf<{ [K in keyof T]: InnerType<T[K]> }>,
> extends UnsizedType<V> {
  #record: T;
  #variantFinder: FindDiscriminant<V, Keys<T>>;
  #discriminant = u8;

  constructor(
    input: T,
    variantFinder: FindDiscriminant<V, Keys<T>>,
  ) {
    super(alignmentOf(input));
    this.#record = input;
    this.#variantFinder = variantFinder;
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): V {
    const discriminant = this.#discriminant.readPacked(dt, {
      byteOffset: options.byteOffset,
    });
    const codec = this.#record[discriminant];
    if (!codec) throw new TypeError("Unknown discriminant");
    return codec.readPacked(dt, options) as V;
  }

  override read(dt: DataView, options: Options = { byteOffset: 0 }): V {
    const discriminant = this.#discriminant.read(dt, {
      byteOffset: options.byteOffset,
    });
    const codec = this.#record[discriminant];
    if (!codec) throw new TypeError("Unknown discriminant");
    return codec.readPacked(dt, options) as V;
  }

  writePacked(
    variant: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    const discriminant = this.#variantFinder(variant);
    const codec = this.#record[discriminant];
    if (!codec) throw new TypeError("Unknown discriminant");
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
    codec.write(variant, dt, options);
  }
}
