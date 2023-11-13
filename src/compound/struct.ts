import {
  AlignedType,
  type InnerType,
  type Options,
  type Packed,
} from "../types/mod.ts";
import { getBiggestAlignment } from "../util.ts";

export class Struct<
  T extends Record<string, AlignedType<unknown>>,
  V extends { [K in keyof T]: InnerType<T[K]> } = {
    [K in keyof T]: InnerType<T[K]>;
  },
> extends AlignedType<V> implements Packed<V> {
  #record: Array<[string, AlignedType<unknown>]>;

  constructor(input: T) {
    super(getBiggestAlignment(input));
    this.#record = Object.entries(input);
  }

  readUnaligned(dt: DataView, options: Options = { byteOffset: 0 }): V {
    if (this.#record.length === 0) return {} as V;

    const result: Record<string, unknown> = {};
    const { 0: key, 1: type } = this.#record[0];
    result[key] = type.readUnaligned(dt, options);

    const len = this.#record.length;

    for (let i = 1; i < len; i++) {
      const { 0: key, 1: type } = this.#record[i];
      result[key] = type.read(dt, options);
    }

    return result as V;
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): V {
    if (this.#record.length === 0) return {} as V;

    const result: Record<string, unknown> = {};

    const len = this.#record.length;
    for (let i = 0; i < len; i++) {
      const { 0: key, 1: type } = this.#record[i];
      result[key] = type.readUnaligned(dt, options);
    }

    return result as V;
  }

  writeUnaligned(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    if (this.#record.length === 0) return;

    const { 0: key, 1: type } = this.#record[0];
    type.writeUnaligned(value[key], dt, options);

    const len = this.#record.length;
    for (let i = 1; i < len; i++) {
      const { 0: key, 1: type } = this.#record[i];
      type.write(value[key], dt, options);
    }
  }

  writePacked(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    if (this.#record.length === 0) return;

    const len = this.#record.length;
    for (let i = 0; i < len; i++) {
      const { 0: key, 1: type } = this.#record[i];
      type.writeUnaligned(value[key], dt, options);
    }
  }
}
