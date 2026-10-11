import {
  type InnerType,
  type Options,
  SizedType,
  UnsizedType,
} from "../types/mod.ts";

/**
 * Wraps a codec so the decoded value is transformed on read and transformed
 * back on write.
 *
 * The byte layout is untouched, so `byteAlignment` and `maxSize` stay those of
 * `type`. Prefer the `map` function over constructing this directly.
 */
export class UnsizedMap<T, V> extends UnsizedType<V> {
  override readonly maxSize: number | null;

  constructor(
    readonly type: UnsizedType<T>,
    readonly decode: (value: T) => V,
    readonly encode: (value: V) => T,
  ) {
    super(type.byteAlignment);
    this.maxSize = type.maxSize;
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): V {
    return this.decode(this.type.readPacked(dt, options));
  }

  override read(dt: DataView, options: Options = { byteOffset: 0 }): V {
    return this.decode(this.type.read(dt, options));
  }

  writePacked(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    this.type.writePacked(this.encode(value), dt, options);
  }

  override write(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    this.type.write(this.encode(value), dt, options);
  }
}

/**
 * Wraps a sized codec so the decoded value is transformed on read and
 * transformed back on write.
 *
 * The byte layout is untouched, so `byteSize` and `byteAlignment` stay those of
 * `type`. Prefer the `map` function over constructing this directly.
 */
export class SizedMap<T, V> extends SizedType<V> implements UnsizedMap<T, V> {
  #inner: UnsizedMap<T, V>;

  constructor(
    readonly type: SizedType<T>,
    readonly decode: (value: T) => V,
    readonly encode: (value: V) => T,
  ) {
    super(type.byteSize, type.byteAlignment);
    this.#inner = new UnsizedMap(type, decode, encode);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): V {
    return this.#inner.readPacked(dt, options);
  }

  override read(dt: DataView, options: Options = { byteOffset: 0 }): V {
    return this.#inner.read(dt, options);
  }

  writePacked(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    this.#inner.writePacked(value, dt, options);
  }

  override write(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    this.#inner.write(value, dt, options);
  }
}

/** `SizedType<V>` when `C` is sized, `UnsizedType<V>` otherwise. */
export type Mapped<C, V> = C extends SizedType<unknown> ? SizedType<V>
  : UnsizedType<V>;

/**
 * Transforms the value a codec decodes to, without changing the bytes it reads
 * or writes. Sized codecs stay sized, so the result can still be a field of a
 * `SizedStruct`.
 *
 * ```ts
 * import { map, Primitives } from "@denosaurs/byte-type";
 *
 * // a u8 where a stored 0 means 256
 * const count = map(Primitives.u8, (v) => v === 0 ? 256 : v, (v) => v === 256 ? 0 : v);
 * ```
 *
 * `encode` is required because `writePacked` is abstract on `UnsizedType`:
 * every codec is expected to work in both directions.
 */
export function map<C extends UnsizedType<unknown>, V>(
  type: C,
  decode: (value: InnerType<C>) => V,
  encode: (value: V) => InnerType<C>,
): Mapped<C, V> {
  const mapped = type instanceof SizedType
    ? new SizedMap(type, decode as (value: unknown) => V, encode)
    : new UnsizedMap(type, decode as (value: unknown) => V, encode);

  return mapped as Mapped<C, V>;
}
