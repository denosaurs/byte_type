import { u8 } from "../primitives/mod.ts";
import {
  AlignedType,
  type InnerType,
  type Options,
  type Packed,
  type ValueOf,
} from "../types/mod.ts";
import { getBiggestAlignment } from "../util.ts";

type Fn<T> = (value: T) => number;

export class TaggedUnion<
  T extends Record<number, AlignedType<unknown>>,
  V extends ValueOf<{ [K in keyof T]: InnerType<T[K]> }> = ValueOf<
    { [K in keyof T]: InnerType<T[K]> }
  >,
> extends AlignedType<V> implements Packed<V> {
  #record: T;
  #variantFinder: Fn<V>;
  #discriminant: AlignedType<number>;

  constructor(
    input: T,
    variantFinder: Fn<V>,
    discriminantCodec: AlignedType<number> = u8,
  ) {
    super(getBiggestAlignment(input));
    this.#record = input;
    this.#variantFinder = variantFinder;
    this.#discriminant = discriminantCodec;
  }

  readUnaligned(dt: DataView, options: Options = { byteOffset: 0 }): V {
    const discriminant = this.#discriminant.readUnaligned(dt, options);
    const codec = this.#record[discriminant];
    if (!codec) throw new TypeError("Unknown discriminant");

    super.alignOffset(options);
    return codec.read(dt, options) as V;
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): V {
    const discriminant = this.#discriminant.readUnaligned(dt, options);
    const codec = this.#record[discriminant];
    if (!codec) throw new TypeError("Unknown discriminant");
    const result = codec.readUnaligned(dt, options) as V;
    return result;
  }

  writeUnaligned(
    variant: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    const discriminant = this.#variantFinder(variant);
    const codec = this.#record[discriminant];
    if (!codec) throw new TypeError("Unknown discriminant");

    super.alignOffset(options);
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
    if (!codec) throw new TypeError("Unknown discriminant");

    this.#discriminant.writeUnaligned(discriminant, dt, options);
    codec.writeUnaligned(variant, dt, options);
  }
}
