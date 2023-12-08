import { AlignedType, type InnerType, type Options } from "../types/mod.ts";
import { getBiggestAlignment } from "../util.ts";

export class Struct<
  T extends Record<string, AlignedType<unknown>>,
  V extends { [K in keyof T]: InnerType<T[K]> } = {
    [K in keyof T]: InnerType<T[K]>;
  },
> extends AlignedType<V> {
  #record: Array<[string, AlignedType<unknown>]>;

  constructor(input: T) {
    super(getBiggestAlignment(input));
    this.#record = Object.entries(input);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): V {
    if (this.#record.length === 0) return {} as V;

    const result: Record<string, unknown> = {};

    for (let i = 0; i < this.#record.length; i++) {
      const { 0: key, 1: type } = this.#record[i];
      result[key] = type.readPacked(dt, options);
    }

    return result as V;
  }

  read(dt: DataView, options: Options = { byteOffset: 0 }): V {
    if (this.#record.length === 0) return {} as V;

    const result: Record<string, unknown> = {};

    for (let i = 0; i < this.#record.length; i++) {
      const { 0: key, 1: type } = this.#record[i];
      result[key] = type.read(dt, options);
    }

    return result as V;
  }

  writePacked(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    if (this.#record.length === 0) return;

    for (let i = 0; i < this.#record.length; i++) {
      const { 0: key, 1: type } = this.#record[i];
      type.writePacked(value[key], dt, options);
    }
  }

  write(value: V, dt: DataView, options: Options = { byteOffset: 0 }): void {
    if (this.#record.length === 0) return;

    for (let i = 0; i < this.#record.length; i++) {
      const { 0: key, 1: type } = this.#record[i];
      type.write(value[key], dt, options);
    }
  }
}
