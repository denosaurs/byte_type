import { type Unsized, UnsizedType } from "./unsized.ts";
import type { Options } from "./_common.ts";

interface Sized<T> extends Unsized<T> {
  readonly byteSize: number;
}

export abstract class SizedType<T> extends UnsizedType<T> implements Sized<T> {
  constructor(readonly byteSize: number, byteAlignment: number = 1) {
    super(byteAlignment);
  }

  protected override incrementOffset(options: Options): void {
    super.incrementOffset(options, this.byteSize);
  }

  protected rangeCheck(byteLength: number, offset: number): void {
    if (this.byteSize > (byteLength - offset)) {
      throw new RangeError("Out of bound");
    }
  }
}
