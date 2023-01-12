import { Type } from "../types.ts";

export class Expect<
  V,
  T extends Type<V>,
> implements Type<V> {
  type: T;
  expected: V;

  constructor(type: T, expected: V) {
    this.type = type;
    this.expected = expected;
  }

  is(value: V | undefined, dataView: DataView, byteOffset = 0): boolean {
    return this.type.read(dataView, byteOffset) === value ?? this.expected;
  }

  read(dataView: DataView, byteOffset = 0): V {
    const value = this.type.read(dataView, byteOffset);

    if (value !== this.expected) {
      throw new TypeError(`Expected ${this.expected} found ${value}`);
    }

    return value;
  }

  write(value: V | undefined, dataView: DataView, byteOffset = 0) {
    this.type.write(value ?? this.expected, dataView, byteOffset);
  }
}
