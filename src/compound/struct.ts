import {
  AlignedType,
  type InnerType,
  type Options,
} from "../types/mod.ts";

export class Struct<
  T extends Record<string, AlignedType<unknown>>,
  V extends { [K in keyof T]: InnerType<T[K]> } = {
    [K in keyof T]: InnerType<T[K]>;
  },
> extends AlignedType<V> {
  #record: T;

  constructor(input: T) {
    // Find biggest alignment
    const byteAlignment = Object.values(input)
      .reduce((acc, x) => Math.max(acc, x.byteAlignment), 0);
    super(byteAlignment);
    this.#record = input;
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): V {
    const result: Record<string, unknown> = {};
    const entries = Object.entries(this.#record);

    for (let i = 0; i < entries.length; i++) {
      const { 0: key, 1: type } = entries[i];
      result[key] = type.readPacked(dt, options);
    }

    return result as V;
  }

  read(dt: DataView, options: Options = { byteOffset: 0 }): V {
    const result: Record<string, unknown> = {};
    const entries = Object.entries(this.#record);

    for (let i = 0; i < entries.length; i++) {
      const { 0: key, 1: type } = entries[i];
      result[key] = type.read(dt, options);
    }

    return result as V;
  }

  writePacked(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    const entries = Object.entries(this.#record);

    for (let i = 0; i < entries.length; i++) {
      const { 0: key, 1: type } = entries[i];
      type.writePacked(value[key], dt, options);
    }
  }
}
