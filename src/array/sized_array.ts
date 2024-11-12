import { type Options, SizedType } from "../types/mod.ts";
import { ArrayType } from "./array.ts";

export class SizedArrayType<T> extends SizedType<T[]> implements ArrayType<T> {
  #inner: ArrayType<T>;

  constructor(readonly type: SizedType<T>, readonly length: number) {
    super(length * type.byteSize, type.byteAlignment);
    this.#inner = new ArrayType(type, length);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): T[] {
    return this.#inner.readPacked(dt, options);
  }

  override read(dt: DataView, options: Options = { byteOffset: 0 }): T[] {
    return this.#inner.read(dt, options);
  }

  writePacked(
    value: T[],
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    this.#inner.writePacked(value, dt, options);
  }

  override write(
    value: T[],
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    this.#inner.write(value, dt, options);
  }
}
