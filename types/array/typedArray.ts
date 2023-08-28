import { SizedType, TypeOptions, ViewableType } from "../types.ts";

export type TypedArray =
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

// deno-fmt-ignore
export type TypedArrayConstructor<T extends TypedArray> =
    T extends Uint8Array ? Uint8ArrayConstructor
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

export class TypedArrayType<T extends TypedArray>
  implements SizedType<T>, ViewableType<T> {
  Constructor: TypedArrayConstructor<T>;
  byteLength: number;

  constructor(Constructor: TypedArrayConstructor<T>, byteLength: number) {
    this.Constructor = Constructor;
    this.byteLength = byteLength;
  }

  read(dataView: DataView, options: TypeOptions = {}): T {
    return this.view(dataView, options).slice() as T;
  }

  write(value: T, dataView: DataView, options: TypeOptions = {}) {
    // @ts-ignore Sets the dataView buffer to the value
    this.view(dataView, options).set(value);
  }

  view(dataView: DataView, options: TypeOptions = {}): T {
    options.byteOffset ??= 0;
    return new this.Constructor(
      dataView.buffer,
      options.byteOffset,
      this.byteLength,
    ) as T;
  }
}

export class Uint8ArrayType extends TypedArrayType<Uint8Array> {
  constructor(byteLength: number) {
    super(Uint8Array, byteLength);
  }
}

export class Uint8ClampedArrayType extends TypedArrayType<Uint8ClampedArray> {
  constructor(byteLength: number) {
    super(Uint8ClampedArray, byteLength);
  }
}

export class Int8ArrayType extends TypedArrayType<Int8Array> {
  constructor(byteLength: number) {
    super(Int8Array, byteLength);
  }
}

export class Uint16ArrayType extends TypedArrayType<Uint16Array> {
  constructor(byteLength: number) {
    super(Uint16Array, byteLength);
  }
}

export class Int16ArrayType extends TypedArrayType<Int16Array> {
  constructor(byteLength: number) {
    super(Int16Array, byteLength);
  }
}

export class Uint32ArrayType extends TypedArrayType<Uint32Array> {
  constructor(byteLength: number) {
    super(Uint32Array, byteLength);
  }
}

export class Int32ArrayType extends TypedArrayType<Int32Array> {
  constructor(byteLength: number) {
    super(Int32Array, byteLength);
  }
}

export class Float32ArrayType extends TypedArrayType<Float32Array> {
  constructor(byteLength: number) {
    super(Float32Array, byteLength);
  }
}

export class Float64ArrayType extends TypedArrayType<Float64Array> {
  constructor(byteLength: number) {
    super(Float64Array, byteLength);
  }
}

export class BigUint64ArrayType extends TypedArrayType<BigUint64Array> {
  constructor(byteLength: number) {
    super(BigUint64Array, byteLength);
  }
}

export class BigInt64ArrayType extends TypedArrayType<BigInt64Array> {
  constructor(byteLength: number) {
    super(BigInt64Array, byteLength);
  }
}
