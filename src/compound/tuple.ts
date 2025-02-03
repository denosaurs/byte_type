import { type InnerType, type Options, UnsizedType } from "../types/mod.ts";
import { alignmentOf } from "../util.ts";

export class Tuple<
  T extends [...UnsizedType<unknown>[]],
  V extends [...unknown[]] = { [I in keyof T]: InnerType<T[I]> },
> extends UnsizedType<V> {
  #tupleTypes: T;
  #length: number;
  constructor(types: T) {
    super(alignmentOf(types));
    this.#tupleTypes = types;
    this.#length = types.length;
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): V {
    if (this.#length === 0) return [] as unknown as V;
    const result: unknown[] = new Array(this.#length);

    const tupleTypes = this.#tupleTypes;
    for (let i = 0; i < result.length; i++) {
      result[i] = tupleTypes[i].readPacked(dt, options);
    }

    return result as V;
  }

  override read(dt: DataView, options: Options = { byteOffset: 0 }): V {
    if (this.#length === 0) return [] as unknown as V;
    const result: unknown[] = new Array(this.#length);

    const tupleTypes = this.#tupleTypes;
    for (let i = 0; i < result.length; i++) {
      result[i] = tupleTypes[i].read(dt, options);
    }

    return result as V;
  }

  writePacked(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    if (value.length !== this.#length) {
      throw new TypeError(
        `value V has more entries than expected\nExpected:${this.#length} but got ${value.length}`,
      );
    }
    if (value.length === 0) return;

    const tupleTypes = this.#tupleTypes;
    for (let i = 0; i < value.length; i++) {
      tupleTypes[i].writePacked(value[i], dt, options);
    }
  }

  override write(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    if (value.length !== this.#length) {
      throw new TypeError(
        `value V has more entries than expected\nExpected:${this.#length} but got ${value.length}`,
      );
    }
    if (value.length === 0) return;

    const tupleTypes = this.#tupleTypes;
    for (let i = 0; i < value.length; i++) {
      tupleTypes[i].write(value[i], dt, options);
    }
  }
}
