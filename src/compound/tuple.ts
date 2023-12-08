import {
  AlignedType,
  type InnerType,
  type Options,
} from "../types/mod.ts";

export class Tuple<
  T extends [...AlignedType<unknown>[]],
  V extends [...unknown[]] = { [I in keyof T]: InnerType<T[I]> },
> extends AlignedType<V> {
  #tupleTypes: T;

  constructor(types: T) {
    super(1);
    this.#tupleTypes = types;
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): V {
    const result: unknown[] = [];
    result.length = this.#tupleTypes.length;

    for (let i = 0; i < result.length; i++) {
      result[i] = this.#tupleTypes[i].readPacked(dt, options);
    }

    return result as V;
  }

  read(dt: DataView, options: Options = { byteOffset: 0 }): V {
    const result: unknown[] = [];
    result.length = this.#tupleTypes.length;

    for (let i = 0; i < result.length; i++) {
      result[i] = this.#tupleTypes[i].read(dt, options);
    }

    return result as V;
  }

  writePacked(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    for (let i = 0; i < this.#tupleTypes.length; i++) {
      this.#tupleTypes[i].writePacked(value[i], dt, options);
    }
  }

  write(value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    for (let i = 0; i < this.#tupleTypes.length; i++) {
      this.#tupleTypes[i].write(value[i], dt, options);
    }
  }
}
