import { type Options, SizedType } from "../types/mod.ts";

type TypedArrays =
  | Uint8Array<ArrayBufferLike>
  | Uint8ClampedArray<ArrayBufferLike>
  | Int8Array<ArrayBufferLike>
  | Uint16Array<ArrayBufferLike>
  | Int16Array<ArrayBufferLike>
  | Uint32Array<ArrayBufferLike>
  | Int32Array<ArrayBufferLike>
  | Float32Array<ArrayBufferLike>
  | Float64Array<ArrayBufferLike>
  | BigUint64Array<ArrayBufferLike>
  | BigInt64Array<ArrayBufferLike>;

type TypedConstructors<T extends TypedArrays> = T extends
  Uint8Array<ArrayBufferLike> ? Uint8ArrayConstructor
  : T extends Uint8ClampedArray<ArrayBufferLike> ? Uint8ClampedArrayConstructor
  : T extends Int8Array<ArrayBufferLike> ? Int8ArrayConstructor
  : T extends Uint16Array<ArrayBufferLike> ? Uint16ArrayConstructor
  : T extends Int16Array<ArrayBufferLike> ? Int16ArrayConstructor
  : T extends Uint32Array<ArrayBufferLike> ? Uint32ArrayConstructor
  : T extends Int32Array<ArrayBufferLike> ? Int32ArrayConstructor
  : T extends Float32Array<ArrayBufferLike> ? Float32ArrayConstructor
  : T extends Float64Array<ArrayBufferLike> ? Float64ArrayConstructor
  : T extends BigUint64Array<ArrayBufferLike> ? BigUint64ArrayConstructor
  : T extends BigInt64Array<ArrayBufferLike> ? BigInt64ArrayConstructor
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
    const value = new this.arrayConstructor(
      // @ts-expect-error:
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
    const view = new this.arrayConstructor(
      // @ts-expect-error:
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
