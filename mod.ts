import { endianess, reorder } from "./util.ts";

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

  read(view: DataView, byteOffset: number): V {
    const tuple = [];

    for (const type of this.types) {
      tuple.push(type.read(view, byteOffset));
      byteOffset += type.byteLength;
    }

    return tuple as V;
  }

  write(view: DataView, byteOffset: number, value: V) {
    let i = 0;
    for (const type of this.types) {
      type.write(view, byteOffset, value[i++]);
      byteOffset += type.byteLength;
    }
  }

  get<I extends keyof V>(view: DataView, byteOffset: number, index: I): V[I] {
    for (let i = 0; i < this.types.length; i++) {
      const type = this.types[i];
      const value = type.read(view, byteOffset);
      byteOffset += type.byteLength;

      if (index === i) {
        return value as V[I];
      }
    }

    throw new RangeError("Index is out of range");
  }

  set<I extends keyof V>(
    view: DataView,
    byteOffset: number,
    index: I,
    value: V[I],
  ) {
    for (let i = 0; i < this.types.length; i++) {
      const type = this.types[i];
      if (index === i) {
        type.write(view, byteOffset, value);
        return;
      }
      byteOffset += type.byteLength;
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

  read(view: DataView, byteOffset: number): string {
    const array = [];

    for (
      let i = byteOffset;
      i < this.byteLength + byteOffset;
      i += this.type.byteLength
    ) {
      array.push(this.type.read(view, i));
    }

    return String.fromCharCode(...array);
  }

  write(view: DataView, byteOffset: number, value: string) {
    for (let i = 0; i < value.length; i++) {
      this.type.write(view, byteOffset, value.charCodeAt(i));
      byteOffset += this.type.byteLength;
    }
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

  is(view: DataView, byteOffset: number, value = this.expected): boolean {
    return this.type.read(view, byteOffset) === value;
  }

  read(view: DataView, byteOffset: number): V {
    const value = this.type.read(view, byteOffset);

    if (value !== this.expected) {
      throw new TypeError(`Expected ${this.expected} found ${value}`);
    }

    return value;
  }

  write(view: DataView, byteOffset: number) {
    this.type.write(view, byteOffset, this.expected);
  }
}
