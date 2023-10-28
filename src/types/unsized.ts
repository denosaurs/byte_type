import type { Options } from "./_common.ts";

export interface Unsized<T> {
  readUnaligned(dt: DataView, options?: Options): T;
  writeUnaligned(value: T, dt: DataView, options?: Options): void;
}

export abstract class UnsizedType<T> implements Unsized<T> {
  abstract readUnaligned(dt: DataView, options?: Options): T;
  abstract writeUnaligned(value: T, dt: DataView, options?: Options): void;

  protected incrementOffset(options: Options, byteSize: number) {
    options.byteOffset += byteSize;
  }
}
