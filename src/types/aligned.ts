import { align } from "../util.ts";
import { type Unsized, UnsizedType } from "./unsized.ts";
import type { Options } from "./_common.ts";

export interface Aligned<T> extends Unsized<T> {
  readonly byteAlignment: number;

  /** In most cases you don't need to reimplement read. as long as your `readUnaligned` is correct */
  read(dt: DataView, options?: Options): T;
  /** In most cases you don't need to reimplement write. as long as your `writeUnaligned` is correct */
  write(value: T, dt: DataView, options?: Options): void;
}

export abstract class AlignedType<T> extends UnsizedType<T>
  implements Aligned<T> {
  constructor(readonly byteAlignment: number) {
    super();
  }

  /** In most cases you don't need to reimplement read. as long as your `readUnaligned` is correct */
  read(dt: DataView, options: Options = { byteOffset: 0 }): T {
    this.alignOffset(options);
    return this.readUnaligned(dt, options);
  }

  /** In most cases you don't need to reimplement write. as long as your `writeUnaligned` is correct */
  write(value: T, dt: DataView, options: Options = { byteOffset: 0 }): void {
    this.alignOffset(options);
    this.writeUnaligned(value, dt, options);
  }

  protected alignOffset(options: Options) {
    options.byteOffset = align(options.byteOffset, this.byteAlignment);
  }
}
