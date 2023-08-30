import { Type, TypeOptions } from "../types.ts";

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

  is(
    value: V | undefined,
    dataView: DataView,
    options: TypeOptions = {},
  ): boolean {
    return this.type.read(dataView, options) === value ??
      this.expected;
  }

  read(dataView: DataView, options: TypeOptions = {}): V {
    const value = this.type.read(dataView, options);

    if (value !== this.expected) {
      throw new TypeError(`Expected ${this.expected} found ${value}`);
    }

    return value;
  }

  write(value: V | undefined, dataView: DataView, options: TypeOptions = {}) {
    this.type.write(value ?? this.expected, dataView, options);
  }
}
