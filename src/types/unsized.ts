import type { Options } from "./_common.ts";

export interface Unsized<T> {
  readPacked(dt: DataView, options?: Options): T;
  writePacked(value: T, dt: DataView, options?: Options): void;
}

export abstract class UnsizedType<T> implements Unsized<T> {
  abstract readPacked(dt: DataView, options?: Options): T;
  abstract writePacked(value: T, dt: DataView, options?: Options): void;

  protected incrementOffset(options: Options, byteSize: number) {
    options.byteOffset += byteSize;
  }
}
