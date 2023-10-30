import { type Aligned, AlignedType } from "./aligned.ts";
import type { Options } from "./_common.ts";

interface Sized<T> extends Aligned<T> {
  readonly byteSize: number;
}

export abstract class SizedType<T> extends AlignedType<T> implements Sized<T> {
  constructor(readonly byteSize: number, byteAlignment: number) {
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
