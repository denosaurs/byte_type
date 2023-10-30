import { type Options, SizedType } from "../types/mod.ts";

type TypedArrays =
  | Uint8Array
  | Uint8ClampedArray
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array
  | BigUint64Array
  | BigInt64Array;

type TypedConstructors<T extends TypedArrays> = T extends Uint8Array
  ? Uint8ArrayConstructor
  : T extends Uint8ClampedArray ? Uint8ClampedArrayConstructor
  : T extends Int8Array ? Int8ArrayConstructor
  : T extends Uint16Array ? Uint16ArrayConstructor
  : T extends Int16Array ? Int16ArrayConstructor
  : T extends Uint32Array ? Uint32ArrayConstructor
  : T extends Int32Array ? Int32ArrayConstructor
  : T extends Float32Array ? Float32ArrayConstructor
  : T extends Float64Array ? Float64ArrayConstructor
  : T extends BigUint64Array ? BigUint64ArrayConstructor
  : T extends BigInt64Array ? BigInt64ArrayConstructor
  : never;

export class TypedArray<T extends TypedArrays> extends SizedType<T> {
  constructor(
    readonly arrayConstructor: TypedConstructors<TypedArrays>,
    readonly length: number,
  ) {
    super(
      length * arrayConstructor.BYTES_PER_ELEMENT,
      arrayConstructor.BYTES_PER_ELEMENT,
    );
  }

  // @TODO: Not sure if this is the behavior we want
  readUnaligned(dt: DataView, options: Options = { byteOffset: 0 }): T {
    super.rangeCheck(dt.byteLength, options.byteOffset);

    const value = new this.arrayConstructor(
      dt.buffer,
      dt.byteOffset + options.byteOffset,
      this.length,
    ) as T;

    super.incrementOffset(options);
    return value;
  }

  // @TODO: Not sure if this is the behavior we want
  writeUnaligned(
    value: T,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    super.rangeCheck(dt.byteLength, options.byteOffset);

    const view = new this.arrayConstructor(
      dt.buffer,
      dt.byteOffset + options.byteOffset,
      this.length,
    );
    view.set(value as unknown as (ArrayLike<number> & ArrayLike<bigint>));
    super.incrementOffset(options);
  }
}

function gen<E extends TypedConstructors<TypedArrays>>(
  constructor: E,
) {
  return class extends TypedArray<ReturnType<E["from"]>> {
    constructor(length: number) {
      super(constructor, length);
    }
  };
}

export const Uint8ArrayType = gen(Uint8Array);
export const Uint8ClampedArrayType = gen(Uint8ClampedArray);
export const Int8ArrayType = gen(Int8Array);
export const Uint16ArrayType = gen(Uint16Array);
export const Int16ArrayType = gen(Int16Array);
export const Uint32ArrayType = gen(Uint32Array);
export const Int32ArrayType = gen(Int32Array);
export const Float32ArrayType = gen(Float32Array);
export const Float64ArrayType = gen(Float64Array);
export const BigUint64ArrayType = gen(BigUint64Array);
export const BigInt64ArrayType = gen(BigInt64Array);
