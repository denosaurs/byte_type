import { type Options, SizedType } from "../types/mod.ts";
import type { OutputRecord } from "./_common.ts";

export class BitFlags64<
  I extends Record<string, bigint>,
  O = OutputRecord<I>,
> extends SizedType<O> {
  #record: I;

  constructor(record: I) {
    super(8, 8);
    this.#record = record;
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): O {
    super.rangeCheck(dt.byteLength, options.byteOffset);

    const returnObject: Record<string, boolean> = {};

    const byteBag = dt.getBigUint64(options.byteOffset);
    for (const { 0: key, 1: flag } of Object.entries(this.#record)) {
      returnObject[key] = (byteBag & flag) === flag;
    }

    super.incrementOffset(options);

    return returnObject as O;
  }

  writePacked(
    value: O,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    super.rangeCheck(dt.byteLength, options.byteOffset);

    let flags = 0n;

    for (const { 0: key, 1: flagValue } of Object.entries(this.#record)) {
      if (value[key as keyof O]) {
        flags |= flagValue;
      }
    }

    dt.setBigUint64(options.byteOffset, flags);
    super.incrementOffset(options);
  }
}
