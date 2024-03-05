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

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): T {
    super.rangeCheck(dt.byteLength, options.byteOffset);

    const value = new this.arrayConstructor(
      dt.buffer,
      dt.byteOffset + options.byteOffset,
      this.length,
    ).slice() as T;

    super.incrementOffset(options);
    return value;
  }

  writePacked(
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

export interface TypedArrayTypeConstructor<T extends TypedArrays> {
  new (length: number): TypedArray<T>;
}

function createTypedArrayType<E extends TypedConstructors<TypedArrays>>(
  constructor: E,
): TypedArrayTypeConstructor<ReturnType<E["from"]>> {
  return class extends TypedArray<ReturnType<E["from"]>> {
    constructor(length: number) {
      super(constructor, length);
    }
  };
}

export const Uint8ArrayType: TypedArrayTypeConstructor<Uint8Array> =
  createTypedArrayType(Uint8Array);
export const Uint8ClampedArrayType: TypedArrayTypeConstructor<
  Uint8ClampedArray
> = createTypedArrayType(Uint8ClampedArray);
export const Int8ArrayType: TypedArrayTypeConstructor<Int8Array> =
  createTypedArrayType(Int8Array);
export const Uint16ArrayType: TypedArrayTypeConstructor<Uint16Array> =
  createTypedArrayType(Uint16Array);
export const Int16ArrayType: TypedArrayTypeConstructor<Int16Array> =
  createTypedArrayType(Int16Array);
export const Uint32ArrayType: TypedArrayTypeConstructor<Uint32Array> =
  createTypedArrayType(Uint32Array);
export const Int32ArrayType: TypedArrayTypeConstructor<Int32Array> =
  createTypedArrayType(Int32Array);
export const Float32ArrayType: TypedArrayTypeConstructor<Float32Array> =
  createTypedArrayType(Float32Array);
export const Float64ArrayType: TypedArrayTypeConstructor<Float64Array> =
  createTypedArrayType(Float64Array);
export const BigUint64ArrayType: TypedArrayTypeConstructor<BigUint64Array> =
  createTypedArrayType(BigUint64Array);
export const BigInt64ArrayType: TypedArrayTypeConstructor<BigInt64Array> =
  createTypedArrayType(BigInt64Array);
