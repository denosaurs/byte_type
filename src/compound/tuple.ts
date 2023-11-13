import {
  AlignedType,
  type InnerType,
  type Options,
  type Packed,
} from "../types/mod.ts";

export class Tuple<
  T extends [...AlignedType<unknown>[]],
  V extends [...unknown[]] = { [I in keyof T]: InnerType<T[I]> },
> extends AlignedType<V> implements Packed<V> {
  #tupleTypes: T;

  constructor(types: T) {
    // Find biggest alignment
    const byteAlignment = Object.values(types)
      .reduce((acc, x) => Math.max(acc, x.byteAlignment), 0);
    super(byteAlignment);
    this.#tupleTypes = types;
  }

  readUnaligned(dt: DataView, options: Options = { byteOffset: 0 }): V {
    if (this.#tupleTypes.length === 0) return [] as unknown as V;

    const result: unknown[] = [];
    result.length = this.#tupleTypes.length;

    result[0] = this.#tupleTypes[0].readUnaligned(dt, options);
    for (let i = 1; i < result.length; i++) {
      result[i] = this.#tupleTypes[i].read(dt, options);
    }

    return result as V;
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): V {
    if (this.#tupleTypes.length === 0) return [] as unknown as V;

    const result: unknown[] = [];
    result.length = this.#tupleTypes.length;

    for (let i = 0; i < result.length; i++) {
      result[i] = this.#tupleTypes[i].readUnaligned(dt, options);
    }

    return result as V;
  }

  writeUnaligned(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    if (value.length === 0) return;

    this.#tupleTypes[0].writeUnaligned(value[0], dt, options);
    for (let i = 1; i < this.#tupleTypes.length; i++) {
      this.#tupleTypes[i].write(value[i], dt, options);
    }
  }

  writePacked(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    if (value.length === 0) return;

    for (let i = 0; i < this.#tupleTypes.length; i++) {
      this.#tupleTypes[i].writeUnaligned(value[i], dt, options);
    }
  }
}
