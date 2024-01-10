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

function createTypedArrayType<E extends TypedConstructors<TypedArrays>>(
  constructor: E,
) {
  return class extends TypedArray<ReturnType<E["from"]>> {
    constructor(length: number) {
      super(constructor, length);
    }
  };
}

export const Uint8ArrayType = createTypedArrayType(Uint8Array);
export const Uint8ClampedArrayType = createTypedArrayType(Uint8ClampedArray);
export const Int8ArrayType = createTypedArrayType(Int8Array);
export const Uint16ArrayType = createTypedArrayType(Uint16Array);
export const Int16ArrayType = createTypedArrayType(Int16Array);
export const Uint32ArrayType = createTypedArrayType(Uint32Array);
export const Int32ArrayType = createTypedArrayType(Int32Array);
export const Float32ArrayType = createTypedArrayType(Float32Array);
export const Float64ArrayType = createTypedArrayType(Float64Array);
export const BigUint64ArrayType = createTypedArrayType(BigUint64Array);
export const BigInt64ArrayType = createTypedArrayType(BigInt64Array);
