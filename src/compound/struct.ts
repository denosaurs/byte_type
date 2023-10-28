import {
  AlignedType,
  type InnerType,
  type Options,
  type Packed,
} from "../types/mod.ts";

export class Struct<
  T extends Record<string, AlignedType<unknown>>,
  V extends { [K in keyof T]: InnerType<T[K]> } = {
    [K in keyof T]: InnerType<T[K]>;
  },
> extends AlignedType<V> implements Packed<V> {
  #record: T;

  constructor(input: T) {
    // Find biggest alignment
    const byteAlignment = Object.values(input)
      .reduce((acc, x) => Math.max(acc, x.byteAlignment), 0);
    super(byteAlignment);
    this.#record = input;
  }

  readUnaligned(dt: DataView, options: Options = { byteOffset: 0 }): V {
    const result: Record<string, unknown> = {};
    const entries = Object.entries(this.#record);
    const { 0: key, 1: type } = entries[0];
    result[key] = type.readUnaligned(dt, options);

    for (let i = 1; i < entries.length; i++) {
      const { 0: key, 1: type } = entries[i];
      result[key] = type.read(dt, options);
    }

    return result as V;
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): V {
    const result: Record<string, unknown> = {};
    const entries = Object.entries(this.#record);

    for (let i = 0; i < entries.length; i++) {
      const { 0: key, 1: type } = entries[i];
      result[key] = type.readUnaligned(dt, options);
    }

    return result as V;
  }

  writeUnaligned(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    const entries = Object.entries(this.#record);
    const { 0: key, 1: type } = entries[0];
    type.writeUnaligned(value[key], dt, options);

    for (let i = 1; i < entries.length; i++) {
      const { 0: key, 1: type } = entries[i];
      type.write(value[key], dt, options);
    }
  }

  writePacked(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    const entries = Object.entries(this.#record);

    for (let i = 0; i < entries.length; i++) {
      const { 0: key, 1: type } = entries[i];
      type.writeUnaligned(value[key], dt, options);
    }
  }
}
