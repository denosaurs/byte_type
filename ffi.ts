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

export type InnerFFIType<T> = T extends FFIType<infer I> ? I : never;

export interface FFIType<T> {
  size?: number;
  read(view: Deno.UnsafePointerView, byteOffset?: number): T;
}

export type SizedFFIType<T> = FFIType<T> & { size: number };

export class I8 implements FFIType<number> {
  size = 1;

  read(view: Deno.UnsafePointerView, byteOffset?: number): number {
    return view.getInt8(byteOffset);
  }
}

export class U8 implements FFIType<number> {
  size = 1;

  read(view: Deno.UnsafePointerView, byteOffset?: number): number {
    return view.getUint8(byteOffset);
  }
}

export class I16 implements FFIType<number> {
  size = 2;

  read(view: Deno.UnsafePointerView, byteOffset?: number): number {
    return view.getInt16(byteOffset);
  }
}

export class U16 implements FFIType<number> {
  size = 2;

  read(view: Deno.UnsafePointerView, byteOffset?: number): number {
    return view.getUint16(byteOffset);
  }
}

export class I32 implements FFIType<number> {
  size = 4;

  read(view: Deno.UnsafePointerView, byteOffset?: number): number {
    return view.getInt32(byteOffset);
  }
}

export class U32 implements FFIType<number> {
  size = 4;

  read(view: Deno.UnsafePointerView, byteOffset?: number): number {
    return view.getUint32(byteOffset);
  }
}

export class I64 implements FFIType<bigint> {
  size = 8;

  read(view: Deno.UnsafePointerView, byteOffset?: number): bigint {
    return view.getBigInt64(byteOffset);
  }
}

export class U64 implements FFIType<bigint> {
  size = 8;

  read(view: Deno.UnsafePointerView, byteOffset?: number): bigint {
    return view.getBigUint64(byteOffset);
  }
}

export class F32 implements FFIType<number> {
  size = 4;

  read(view: Deno.UnsafePointerView, byteOffset?: number): number {
    return view.getFloat32(byteOffset);
  }
}

export class F64 implements FFIType<number> {
  size = 8;

  read(view: Deno.UnsafePointerView, byteOffset?: number): number {
    return view.getFloat64(byteOffset);
  }
}

export class Bool implements FFIType<boolean> {
  size = 1;

  read(view: Deno.UnsafePointerView, byteOffset?: number): boolean {
    return view.getInt8(byteOffset) === 1;
  }
}

export class Struct<
  T extends Record<string, SizedFFIType<unknown>>,
  V extends Record<string, unknown> = { [K in keyof T]: InnerFFIType<T[K]> },
> implements FFIType<V> {
  size: number;
  types: T;

  constructor(types: T) {
    this.types = types;
    this.size = 0;

    for (const type of Object.values(this.types)) {
      this.size += type.size;
    }
  }

  read(view: Deno.UnsafePointerView, byteOffset = 0): V {
    const object: Record<string, unknown> = {};

    for (const [key, type] of Object.entries(this.types)) {
      object[key] = type.read(view, byteOffset);
      byteOffset += type.size;
    }

    return object as V;
  }

  get<K extends keyof T>(
    view: Deno.UnsafePointerView,
    byteOffset = 0,
    key: K,
  ): InnerFFIType<T[K]> | undefined {
    for (const [entry, type] of Object.entries(this.types)) {
      const value = type.read(view, byteOffset);
      byteOffset += type.size;

      if (entry === key) {
        return value as InnerFFIType<T[K]>;
      }
    }
  }
}

export class FixedArray<T extends SizedFFIType<V>, V> implements FFIType<V[]> {
  size: number;
  type: T;

  constructor(type: T, length: number) {
    this.type = type;
    this.size = length * type.size;
  }

  read(view: Deno.UnsafePointerView, byteOffset = 0): V[] {
    const array = [];

    for (let i = byteOffset; i < this.size + byteOffset; i += this.type.size) {
      array.push(this.type.read(view, i));
    }

    return array;
  }

  get(view: Deno.UnsafePointerView, byteOffset = 0, index: number): V {
    return this.type.read(view, byteOffset + index * this.type.size);
  }
}

export class Tuple<
  T extends [...SizedFFIType<unknown>[]],
  V extends [...unknown[]] = { [I in keyof T]: InnerFFIType<T[I]> },
> implements SizedFFIType<V> {
  size: number;
  types: T;

  constructor(types: T) {
    this.types = types;
    this.size = 0;

    for (const type of types) {
      this.size += type.size;
    }
  }

  read(view: Deno.UnsafePointerView, byteOffset = 0): V {
    const tuple = [];

    for (const type of this.types) {
      tuple.push(type.read(view, byteOffset));
      byteOffset += type.size;
    }

    return tuple as V;
  }

  get<I extends keyof V>(
    view: Deno.UnsafePointerView,
    byteOffset = 0,
    index: I,
  ): V[I] {
    for (let i = 0; i < this.types.length; i++) {
      const type = this.types[i];
      const value = type.read(view, byteOffset);
      byteOffset += type.size;

      if (index === i) {
        return value as V[I];
      }
    }

    throw new RangeError("Index is out of range");
  }
}

export class FixedString implements FFIType<string> {
  size: number;
  type: SizedFFIType<number>;

  constructor(length: number, type: SizedFFIType<number> = u8) {
    this.size = length * type.size;
    this.type = type;
  }

  read(view: Deno.UnsafePointerView, byteOffset = 0): string {
    const array = [];

    for (let i = byteOffset; i < this.size + byteOffset; i += this.type.size) {
      array.push(this.type.read(view, i));
    }

    return String.fromCharCode(...array);
  }
}

export class CString implements FFIType<string> {
  read(view: Deno.UnsafePointerView, byteOffset?: number): string {
    return view.getCString(byteOffset);
  }
}

export class Pointer implements FFIType<Deno.UnsafePointer> {
  size: number;
  type: SizedFFIType<bigint>;

  constructor(type: SizedFFIType<bigint> = u64) {
    this.size = type.size;
    this.type = type;
  }

  read(view: Deno.UnsafePointerView, byteOffset?: number): Deno.UnsafePointer {
    return new Deno.UnsafePointer(this.type.read(view, byteOffset));
  }
}

export class PointerValue<T extends FFIType<V>, V> implements FFIType<V> {
  size: number;
  pointer: SizedFFIType<Deno.UnsafePointer>;
  inner: T;

  constructor(
    inner: T,
    pointerType: SizedFFIType<Deno.UnsafePointer> = pointer,
  ) {
    this.size = pointerType.size;
    this.pointer = pointerType;
    this.inner = inner;
  }

  read(view: Deno.UnsafePointerView, byteOffset?: number): V {
    return this.inner.read(
      new Deno.UnsafePointerView(this.pointer.read(view, byteOffset)),
    ) as V;
  }
}

export class BitFlags8<
  T extends Record<string, number>,
  V extends Record<string, boolean> = { [K in keyof T]: boolean },
> implements FFIType<V> {
  size = 1;
  flags: T;

  constructor(flags: T) {
    this.flags = flags;
  }

  read(view: Deno.UnsafePointerView, byteOffset?: number): V {
    const flags = view.getUint8(byteOffset);
    const ret: Record<string, boolean> = {};

    for (const [key, flag] of Object.entries(this.flags)) {
      ret[key] = (flags & flag) === flag;
    }

    return ret as V;
  }
}

export class BitFlags16<
  T extends Record<string, number>,
  V extends Record<string, boolean> = { [K in keyof T]: boolean },
> implements FFIType<V> {
  size = 2;
  flags: T;

  constructor(flags: T) {
    this.flags = flags;
  }

  read(view: Deno.UnsafePointerView, byteOffset?: number): V {
    const flags = view.getUint16(byteOffset);
    const ret: Record<string, boolean> = {};

    for (const [key, flag] of Object.entries(this.flags)) {
      ret[key] = (flags & flag) === flag;
    }

    return ret as V;
  }
}

export class BitFlags32<
  T extends Record<string, number>,
  V extends Record<string, boolean> = { [K in keyof T]: boolean },
> implements FFIType<V> {
  size = 4;
  flags: T;

  constructor(flags: T) {
    this.flags = flags;
  }

  read(view: Deno.UnsafePointerView, byteOffset?: number): V {
    const flags = view.getUint32(byteOffset);
    const ret: Record<string, boolean> = {};

    for (const [key, flag] of Object.entries(this.flags)) {
      ret[key] = (flags & flag) === flag;
    }

    return ret as V;
  }
}

export class BitFlags64<
  T extends Record<string, bigint>,
  V extends Record<string, boolean> = { [K in keyof T]: boolean },
> implements FFIType<V> {
  size = 8;
  flags: T;

  constructor(flags: T) {
    this.flags = flags;
  }

  read(view: Deno.UnsafePointerView, byteOffset?: number): V {
    const flags = view.getBigUint64(byteOffset);
    const ret: Record<string, boolean> = {};

    for (const [key, flag] of Object.entries(this.flags)) {
      ret[key] = (flags & flag) === flag;
    }

    return ret as V;
  }
}

export class Expect<
  V,
  T extends FFIType<V>,
> implements FFIType<V> {
  size;
  type: T;
  expected: V;

  constructor(type: T, expected: V) {
    this.size = type.size;
    this.type = type;
    this.expected = expected;
  }

  is(
    view: Deno.UnsafePointerView,
    byteOffset?: number,
    value = this.expected,
  ): boolean {
    return this.type.read(view, byteOffset) === value;
  }

  read(view: Deno.UnsafePointerView, byteOffset?: number): V {
    const value = this.type.read(view, byteOffset);

    if (value !== this.expected) {
      throw new TypeError(`Expected ${this.expected} found ${value}`);
    }

    return value;
  }
}

export class TypedArrayFFIType<T extends TypedArray> implements FFIType<T> {
  size: number;
  length: number;
  type: TypedArrayConstructor<T>;

  constructor(type: TypedArrayConstructor<T>, length: number) {
    this.size = length * type.BYTES_PER_ELEMENT;
    this.length = length;
    this.type = type;
  }

  read(view: Deno.UnsafePointerView, byteOffset?: number): T {
    const array = new this.type(this.length);
    view.copyInto(array, byteOffset);
    return array as T;
  }
}

export class Uint8ArrayFFIType extends TypedArrayFFIType<Uint8Array> {
  constructor(length: number) {
    super(Uint8Array, length);
  }
}

export class Uint8ClampedArrayFFIType
  extends TypedArrayFFIType<Uint8ClampedArray> {
  constructor(length: number) {
    super(Uint8ClampedArray, length);
  }
}

export class Int8ArrayFFIType extends TypedArrayFFIType<Int8Array> {
  constructor(length: number) {
    super(Int8Array, length);
  }
}

export class Uint16ArrayFFIType extends TypedArrayFFIType<Uint16Array> {
  constructor(length: number) {
    super(Uint16Array, length);
  }
}

export class Int16ArrayFFIType extends TypedArrayFFIType<Int16Array> {
  constructor(length: number) {
    super(Int16Array, length);
  }
}

export class Uint32ArrayFFIType extends TypedArrayFFIType<Uint32Array> {
  constructor(length: number) {
    super(Uint32Array, length);
  }
}

export class Int32ArrayFFIType extends TypedArrayFFIType<Int32Array> {
  constructor(length: number) {
    super(Int32Array, length);
  }
}

export class Float32ArrayFFIType extends TypedArrayFFIType<Float32Array> {
  constructor(length: number) {
    super(Float32Array, length);
  }
}

export class Float64ArrayFFIType extends TypedArrayFFIType<Float64Array> {
  constructor(length: number) {
    super(Float64Array, length);
  }
}

export class BigUint64ArrayFFIType extends TypedArrayFFIType<BigUint64Array> {
  constructor(length: number) {
    super(BigUint64Array, length);
  }
}

export class BigInt64ArrayFFIType extends TypedArrayFFIType<BigInt64Array> {
  constructor(length: number) {
    super(BigInt64Array, length);
  }
}

export const i8 = new I8();
export const u8 = new U8();
export const i16 = new I16();
export const u16 = new U16();
export const i32 = new I32();
export const u32 = new U32();
export const i64 = new I64();
export const u64 = new U64();
export const f32 = new F32();
export const f64 = new F64();
export const bool = new Bool();
export const pointer = new Pointer();
export const cstring = new CString();
