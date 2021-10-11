function reorder<
  V extends Record<string, unknown>,
  T extends Record<string, unknown> = { [K in keyof V]: unknown },
>(object: V, order: T): T {
  const reordered: Record<string, unknown> = {};

  for (const key of Object.keys(order)) {
    reordered[key] = object[key];
  }

  return reordered as T;
}

/**
 * Checks the endianess of your machine, returns true
 * if little endian and false if big endian.
 */
export function endianess(): boolean {
  const buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, 256, true);
  return new Int16Array(buffer)[0] === 256;
}

export type InnerType<T> = T extends Type<infer I> ? I : never;

export interface Type<T> {
  readonly size: number;
  readonly endian?: boolean;

  read(view: DataView, offset: number): T;
  write(view: DataView, offset: number, value: T): void;
}

export class I8 implements Type<number> {
  readonly size = 1;

  read(view: DataView, offset: number): number {
    return view.getInt8(offset);
  }

  write(view: DataView, offset: number, value: number) {
    view.setInt8(offset, value);
    return view.buffer;
  }
}

export class U8 implements Type<number> {
  readonly size = 1;

  read(view: DataView, offset: number): number {
    return view.getUint8(offset);
  }

  write(view: DataView, offset: number, value: number) {
    view.setUint8(offset, value);
    return view.buffer;
  }
}

export class I16 implements Type<number> {
  readonly size = 2;
  readonly endian;

  constructor(endian: boolean = endianess()) {
    this.endian = endian;
  }

  read(view: DataView, offset: number): number {
    return view.getInt16(offset, this.endian);
  }

  write(view: DataView, offset: number, value: number) {
    view.setInt16(offset, value, this.endian);
    return view.buffer;
  }
}

export class U16 implements Type<number> {
  readonly size = 2;
  readonly endian;

  constructor(endian: boolean = endianess()) {
    this.endian = endian;
  }

  read(view: DataView, offset: number): number {
    return view.getUint16(offset, this.endian);
  }

  write(view: DataView, offset: number, value: number) {
    view.setUint16(offset, value, this.endian);
    return view.buffer;
  }
}

export class I32 implements Type<number> {
  readonly size = 4;
  readonly endian;

  constructor(endian: boolean = endianess()) {
    this.endian = endian;
  }

  read(view: DataView, offset: number): number {
    return view.getInt32(offset, this.endian);
  }

  write(view: DataView, offset: number, value: number) {
    view.setInt32(offset, value, this.endian);
    return view.buffer;
  }
}

export class U32 implements Type<number> {
  readonly size = 4;
  readonly endian;

  constructor(endian: boolean = endianess()) {
    this.endian = endian;
  }

  read(view: DataView, offset: number): number {
    return view.getUint32(offset, this.endian);
  }

  write(view: DataView, offset: number, value: number) {
    view.setUint32(offset, value, this.endian);
    return view.buffer;
  }
}

export class I64 implements Type<bigint> {
  readonly size = 8;
  readonly endian;

  constructor(endian: boolean = endianess()) {
    this.endian = endian;
  }

  read(view: DataView, offset: number): bigint {
    return view.getBigInt64(offset, this.endian);
  }

  write(view: DataView, offset: number, value: bigint) {
    view.setBigInt64(offset, value, this.endian);
    return view.buffer;
  }
}

export class U64 implements Type<bigint> {
  readonly size = 8;
  readonly endian;

  constructor(endian: boolean = endianess()) {
    this.endian = endian;
  }

  read(view: DataView, offset: number): bigint {
    return view.getBigUint64(offset, this.endian);
  }

  write(view: DataView, offset: number, value: bigint) {
    view.setBigUint64(offset, value, this.endian);
    return view.buffer;
  }
}

export class F32 implements Type<number> {
  readonly size = 4;
  readonly endian;

  constructor(endian: boolean = endianess()) {
    this.endian = endian;
  }

  read(view: DataView, offset: number): number {
    return view.getFloat32(offset, this.endian);
  }

  write(view: DataView, offset: number, value: number) {
    view.setFloat32(offset, value, this.endian);
    return view.buffer;
  }
}

export class F64 implements Type<number> {
  readonly size = 8;
  readonly endian;

  constructor(endian: boolean = endianess()) {
    this.endian = endian;
  }

  read(view: DataView, offset: number): number {
    return view.getFloat64(offset, this.endian);
  }

  write(view: DataView, offset: number, value: number) {
    view.setFloat64(offset, value, this.endian);
    return view.buffer;
  }
}

export class Bool implements Type<boolean> {
  readonly size = 1;

  read(view: DataView, offset: number): boolean {
    return view.getInt8(offset) === 1;
  }

  write(view: DataView, offset: number, value: boolean) {
    view.setInt8(offset, value ? 1 : 0);
    return view.buffer;
  }
}

export class Struct<
  T extends Record<string, Type<unknown>>,
  V extends Record<string, unknown> = { [K in keyof T]: InnerType<T[K]> },
> implements Type<V> {
  readonly size: number;
  types: T;

  constructor(types: T) {
    this.types = types;
    this.size = 0;

    for (const type of Object.values(this.types)) {
      this.size += type.size;
    }
  }

  read(view: DataView, offset: number): V {
    const object: Record<string, unknown> = {};

    for (const [key, type] of Object.entries(this.types)) {
      object[key] = type.read(view, offset);
      offset += type.size;
    }

    return object as V;
  }

  write(view: DataView, offset: number, value: V) {
    for (const [key, val] of Object.entries(reorder(value, this.types))) {
      this.types[key].write(view, offset, val);
      offset += this.types[key].size;
    }
  }

  get<K extends keyof T>(
    view: DataView,
    offset: number,
    key: K,
  ): InnerType<T[K]> | undefined {
    for (const [entry, type] of Object.entries(this.types)) {
      const value = type.read(view, offset);
      offset += type.size;

      if (entry === key) {
        return value as InnerType<T[K]>;
      }
    }
  }

  set<K extends keyof T>(
    view: DataView,
    offset: number,
    key: K,
    value: InnerType<T[K]>,
  ) {
    for (const [entry, type] of Object.entries(this.types)) {
      if (entry === key) {
        type.write(view, offset, value);
        return;
      }

      offset += type.size;
    }
  }
}

export class FixedArray<T extends Type<V>, V> implements Type<V[]> {
  readonly size: number;
  type: T;

  constructor(type: T, length: number) {
    this.type = type;
    this.size = length * type.size;
  }

  read(view: DataView, offset: number): V[] {
    const array = [];

    for (let i = offset; i < this.size + offset; i += this.type.size) {
      array.push(this.type.read(view, i));
    }

    return array;
  }

  write(view: DataView, offset: number, value: V[]) {
    for (let i = 0; i < value.length; i++) {
      this.type.write(view, offset, value[i]);
      offset += this.type.size;
    }
  }

  get(view: DataView, offset: number, index: number): V {
    return this.type.read(view, offset + index * this.type.size);
  }

  set(view: DataView, offset: number, index: number, value: V) {
    this.type.write(view, offset + index * this.type.size, value);
  }
}

export class Tuple<
  T extends [...Type<unknown>[]],
  V extends [...unknown[]] = { [I in keyof T]: InnerType<T[I]> },
> implements Type<V> {
  readonly size: number;
  types: T;

  constructor(types: T) {
    this.types = types;
    this.size = 0;

    for (const type of types) {
      this.size += type.size;
    }
  }

  read(view: DataView, offset: number): V {
    const tuple = [];

    for (const type of this.types) {
      tuple.push(type.read(view, offset));
      offset += type.size;
    }

    return tuple as V;
  }

  write(view: DataView, offset: number, value: V) {
    let i = 0;
    for (const type of this.types) {
      type.write(view, offset, value[i++]);
      offset += type.size;
    }
  }

  get<I extends keyof V>(view: DataView, offset: number, index: I): V[I] {
    for (let i = 0; i < this.types.length; i++) {
      const type = this.types[i];
      const value = type.read(view, offset);
      offset += type.size;

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
      offset += type.size;
    }

    throw new RangeError("Index is out of range");
  }
}

export class FixedString implements Type<string> {
  readonly size: number;
  type: Type<number>;

  constructor(length: number, type: Type<number> = u16) {
    this.size = length * type.size;
    this.type = type;
  }

  read(view: DataView, offset: number): string {
    const array = [];

    for (let i = offset; i < this.size + offset; i += this.type.size) {
      array.push(this.type.read(view, i));
    }

    return String.fromCharCode(...array);
  }

  write(view: DataView, offset: number, value: string) {
    for (let i = 0; i < value.length; i++) {
      this.type.write(view, offset, value.charCodeAt(i));
      offset += this.type.size;
    }
  }
}

export class BitFlags8<
  T extends Record<string, number>,
  V extends Record<string, boolean> = { [K in keyof T]: boolean },
> implements Type<V> {
  readonly size = 1;
  flags: T;

  constructor(flags: T) {
    this.flags = flags;
  }

  read(view: DataView, offset: number): V {
    const flags = view.getUint8(offset);
    const ret: Record<string, boolean> = {};

    for (const [key, flag] of Object.entries(this.flags)) {
      ret[key] = ((flags & flag) === flag);
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
  readonly size = 2;
  readonly endian;
  flags: T;

  constructor(flags: T, endian: boolean = endianess()) {
    this.flags = flags;
    this.endian = endian;
  }

  read(view: DataView, offset: number): V {
    const flags = view.getUint16(offset, this.endian);
    const ret: Record<string, boolean> = {};

    for (const [key, flag] of Object.entries(this.flags)) {
      ret[key] = ((flags & flag) === flag);
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
  readonly size = 4;
  readonly endian;
  flags: T;

  constructor(flags: T, endian: boolean = endianess()) {
    this.flags = flags;
    this.endian = endian;
  }

  read(view: DataView, offset: number): V {
    const flags = view.getUint32(offset, this.endian);
    const ret: Record<string, boolean> = {};

    for (const [key, flag] of Object.entries(this.flags)) {
      ret[key] = ((flags & flag) === flag);
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
  readonly size = 8;
  readonly endian;
  flags: T;

  constructor(flags: T, endian: boolean = endianess()) {
    this.flags = flags;
    this.endian = endian;
  }

  read(view: DataView, offset: number): V {
    const flags = view.getBigUint64(offset, this.endian);
    const ret: Record<string, boolean> = {};

    for (const [key, flag] of Object.entries(this.flags)) {
      ret[key] = ((flags & flag) === flag);
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
  readonly size;
  type: T;
  expected: V;

  constructor(type: T, expected: V) {
    this.size = type.size;
    this.type = type;
    this.expected = expected;
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

export const i8 = new I8();
export const u8 = new U8();
export const i16 = new I16();
export const i16le = new I16(true);
export const i16be = new I16(false);
export const u16 = new U16();
export const u16le = new U16(true);
export const u16be = new U16(false);
export const i32 = new I32();
export const i32le = new I32(true);
export const i32be = new I32(false);
export const u32 = new U32();
export const u32le = new U32(true);
export const u32be = new U32(false);
export const i64 = new I64();
export const i64le = new I64(true);
export const i64be = new I64(false);
export const u64 = new U64();
export const u64le = new U64(true);
export const u64be = new U64(false);
export const f32 = new F32();
export const f32le = new F32(true);
export const f32be = new F32(false);
export const f64 = new F64();
export const f64le = new F64(true);
export const f64be = new F64(false);
export const bool = new Bool();
