import { type Unsized, UnsizedType } from "./unsized.ts";
import type { Options } from "./common.ts";
import { align } from "../util.ts";

interface Sized<T> extends Unsized<T> {
  readonly byteSize: number;
}

/**
 * `SizedType<T>` is one of the two base classes for implementing a codec.
 *
 * It is recommended to use this class if you know the size of your type ahead of time.
 * In future released this may be used for certain optimizations
 */
export abstract class SizedType<T> extends UnsizedType<T> implements Sized<T> {
  override maxSize: number | null;

  constructor(readonly byteSize: number, byteAlignment: number = 1) {
    super(byteAlignment);
    this.maxSize = align(byteSize, byteAlignment);
  }

  /** Increments offset by `this.byteSize` */
  protected override incrementOffset(options: Options): void {
    super.incrementOffset(options, this.byteSize);
  }
}
