
import {align} from "../util.ts";
import type { Options } from "./_common.ts";

export interface Unsized<T> {
  readonly byteAlignment: number;

  readPacked(dt: DataView, options?: Options): T;
  writePacked(value: T, dt: DataView, options?: Options): void;
}

export abstract class UnsizedType<T> implements Unsized<T> {
  constructor(readonly byteAlignment: number) {}

  abstract readPacked(dt: DataView, options?: Options): T;
  abstract writePacked(value: T, dt: DataView, options?: Options): void;

  /** In most cases you don't need to reimplement read. as long as your `readPacked` is correct */
  read(dt: DataView, options: Options = { byteOffset: 0 }): T {
    this.alignOffset(options);
    return this.readPacked(dt, options);
  }

  /** In most cases you don't need to reimplement write. as long as your `writePacked` is correct */
  write(value: T, dt: DataView, options: Options = { byteOffset: 0 }): void {
    this.alignOffset(options);
    this.writePacked(value, dt, options);
  }

  protected alignOffset(options: Options) {
    options.byteOffset = align(options.byteOffset, this.byteAlignment);
  }

  protected incrementOffset(options: Options, byteSize: number) {
    options.byteOffset += byteSize;
  }
}
