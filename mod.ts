import { endianess, reorder } from "./util.ts";

export class FixedArray<T extends Type<V>, V> implements Type<V[]> {
  byteLength: number;
  type: T;

  constructor(type: T, length: number) {
    this.type = type;
    this.byteLength = length * type.byteLength;
  }

  read(view: DataView, offset: number): V[] {
    const array = [];

    for (
      let i = offset;
      i < this.byteLength + offset;
      i += this.type.byteLength
    ) {
      array.push(this.type.read(view, i));
    }

    return array;
  }

  write(view: DataView, offset: number, value: V[]) {
    for (let i = 0; i < value.length; i++) {
      this.type.write(view, offset, value[i]);
      offset += this.type.byteLength;
    }
  }

  get(view: DataView, offset: number, index: number): V {
    return this.type.read(view, offset + index * this.type.byteLength);
  }

  set(view: DataView, offset: number, index: number, value: V) {
    this.type.write(view, offset + index * this.type.byteLength, value);
  }
}

export class Tuple<
  T extends [...Type<unknown>[]],
  V extends [...unknown[]] = { [I in keyof T]: InnerType<T[I]> },
> implements Type<V> {
  byteLength: number;
  types: T;

  constructor(types: T) {
    this.types = types;
    this.byteLength = 0;

    for (const type of types) {
      this.byteLength += type.byteLength;
    }
  }

  read(view: DataView, offset: number): V {
    const tuple = [];

    for (const type of this.types) {
      tuple.push(type.read(view, offset));
      offset += type.byteLength;
    }

    return tuple as V;
  }

  write(view: DataView, offset: number, value: V) {
    let i = 0;
    for (const type of this.types) {
      type.write(view, offset, value[i++]);
      offset += type.byteLength;
    }
  }

  get<I extends keyof V>(view: DataView, offset: number, index: I): V[I] {
    for (let i = 0; i < this.types.length; i++) {
      const type = this.types[i];
      const value = type.read(view, offset);
      offset += type.byteLength;

      if (index === i) {
        return value as V[I];
      }
    }

    throw new RangeError("Index is out of range");
  }

  set<I extends keyof V>(
    view: DataView,
    offset: number,
    index: I,
    value: V[I],
  ) {
    for (let i = 0; i < this.types.length; i++) {
      const type = this.types[i];
      if (index === i) {
        type.write(view, offset, value);
        return;
      }
      offset += type.byteLength;
    }

    throw new RangeError("Index is out of range");
  }
}

export class FixedString implements Type<string> {
  byteLength: number;
  type: Type<number>;

  constructor(length: number, type: Type<number> = u16) {
    this.byteLength = length * type.byteLength;
    this.type = type;
  }

  read(view: DataView, offset: number): string {
    const array = [];

    for (
      let i = offset;
      i < this.byteLength + offset;
      i += this.type.byteLength
    ) {
      array.push(this.type.read(view, i));
    }

    return String.fromCharCode(...array);
  }

  write(view: DataView, offset: number, value: string) {
    for (let i = 0; i < value.length; i++) {
      this.type.write(view, offset, value.charCodeAt(i));
      offset += this.type.byteLength;
    }
  }
}

export class BitFlags8<
  T extends Record<string, number>,
  V extends Record<string, boolean> = { [K in keyof T]: boolean },
> implements Type<V> {
  byteLength = 1;
  flags: T;

  constructor(flags: T) {
    this.flags = flags;
  }

  read(view: DataView, offset: number): V {
    const flags = view.getUint8(offset);
    const ret: Record<string, boolean> = {};

    for (const [key, flag] of Object.entries(this.flags)) {
      ret[key] = (flags & flag) === flag;
    }

    return ret as V;
  }

  write(view: DataView, offset: number, value: V) {
    let flags = 0;

    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) {
        flags |= this.flags[key];
      }
    }

    view.setUint8(offset, flags);
  }
}

export class BitFlags16<
  T extends Record<string, number>,
  V extends Record<string, boolean> = { [K in keyof T]: boolean },
> implements Type<V> {
  byteLength = 2;
  endian;
  flags: T;

  constructor(flags: T, endian: boolean = endianess()) {
    this.flags = flags;
    this.endian = endian;
  }

  read(view: DataView, offset: number): V {
    const flags = view.getUint16(offset, this.endian);
    const ret: Record<string, boolean> = {};

    for (const [key, flag] of Object.entries(this.flags)) {
      ret[key] = (flags & flag) === flag;
    }

    return ret as V;
  }

  write(view: DataView, offset: number, value: V) {
    let flags = 0;

    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) {
        flags |= this.flags[key];
      }
    }

    view.setUint16(offset, flags, this.endian);
  }
}

export class BitFlags32<
  T extends Record<string, number>,
  V extends Record<string, boolean> = { [K in keyof T]: boolean },
> implements Type<V> {
  byteLength = 4;
  endian;
  flags: T;

  constructor(flags: T, endian: boolean = endianess()) {
    this.flags = flags;
    this.endian = endian;
  }

  read(view: DataView, offset: number): V {
    const flags = view.getUint32(offset, this.endian);
    const ret: Record<string, boolean> = {};

    for (const [key, flag] of Object.entries(this.flags)) {
      ret[key] = (flags & flag) === flag;
    }

    return ret as V;
  }

  write(view: DataView, offset: number, value: V) {
    let flags = 0;

    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) {
        flags |= this.flags[key];
      }
    }

    view.setUint32(offset, flags, this.endian);
  }
}

export class BitFlags64<
  T extends Record<string, bigint>,
  V extends Record<string, boolean> = { [K in keyof T]: boolean },
> implements Type<V> {
  byteLength = 8;
  endian;
  flags: T;

  constructor(flags: T, endian: boolean = endianess()) {
    this.flags = flags;
    this.endian = endian;
  }

  read(view: DataView, offset: number): V {
    const flags = view.getBigUint64(offset, this.endian);
    const ret: Record<string, boolean> = {};

    for (const [key, flag] of Object.entries(this.flags)) {
      ret[key] = (flags & flag) === flag;
    }

    return ret as V;
  }

  write(view: DataView, offset: number, value: V) {
    let flags = 0n;

    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) {
        flags |= this.flags[key];
      }
    }

    view.setBigUint64(offset, flags, this.endian);
  }
}

export class Expect<
  V,
  T extends Type<V>,
> implements Type<V> {
  byteLength;
  type: T;
  expected: V;

  constructor(type: T, expected: V) {
    this.byteLength = type.byteLength;
    this.type = type;
    this.expected = expected;
  }

  is(view: DataView, offset: number, value = this.expected): boolean {
    return this.type.read(view, offset) === value;
  }

  read(view: DataView, offset: number): V {
    const value = this.type.read(view, offset);

    if (value !== this.expected) {
      throw new TypeError(`Expected ${this.expected} found ${value}`);
    }

    return value;
  }

  write(view: DataView, offset: number) {
    this.type.write(view, offset, this.expected);
  }
}

export class ArrayBufferType implements Type<ArrayBuffer> {
  byteLength: number;
  readonly length: number;

  constructor(length: number) {
    this.byteLength = length;
    this.length = length;
    this.type = type;
  }

  read(view: DataView, offset: number): T {
    return new this.type(view.buffer, offset, this.length) as T;
  }

  write(view: DataView, offset: number, value: T) {
    new this.type(view.buffer, offset).set(
      value as unknown as ArrayLike<number> & ArrayLike<bigint>,
    );
  }
}

export class Uint8ArrayType extends TypedArrayType<Uint8Array> {
  constructor(length: number) {
    super(Uint8Array, length);
  }
}

export class Uint8ClampedArrayType extends TypedArrayType<Uint8ClampedArray> {
  constructor(length: number) {
    super(Uint8ClampedArray, length);
  }
}

export class Int8ArrayType extends TypedArrayType<Int8Array> {
  constructor(length: number) {
    super(Int8Array, length);
  }
}

export class Uint16ArrayType extends TypedArrayType<Uint16Array> {
  constructor(length: number) {
    super(Uint16Array, length);
  }
}

export class Int16ArrayType extends TypedArrayType<Int16Array> {
  constructor(length: number) {
    super(Int16Array, length);
  }
}

export class Uint32ArrayType extends TypedArrayType<Uint32Array> {
  constructor(length: number) {
    super(Uint32Array, length);
  }
}

export class Int32ArrayType extends TypedArrayType<Int32Array> {
  constructor(length: number) {
    super(Int32Array, length);
  }
}

export class Float32ArrayType extends TypedArrayType<Float32Array> {
  constructor(length: number) {
    super(Float32Array, length);
  }
}

export class Float64ArrayType extends TypedArrayType<Float64Array> {
  constructor(length: number) {
    super(Float64Array, length);
  }
}

export class BigUint64ArrayType extends TypedArrayType<BigUint64Array> {
  constructor(length: number) {
    super(BigUint64Array, length);
  }
}

export class BigInt64ArrayType extends TypedArrayType<BigInt64Array> {
  constructor(length: number) {
    super(BigInt64Array, length);
  }
}
