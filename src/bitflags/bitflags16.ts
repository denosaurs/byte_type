import { type Options, SizedType } from "../types/mod.ts";
import type { OutputRecord } from "./_common.ts";

export class BitFlags16<
  I extends Record<string, number>,
  O = OutputRecord<I>,
> extends SizedType<O> {
  #record: I;

  constructor(record: I) {
    super(2, 2);
    this.#record = record;
  }

  readUnaligned(dt: DataView, options: Options = { byteOffset: 0 }): O {
    const returnObject: Record<string, boolean> = {};

    const byteBag = dt.getUint16(options.byteOffset);
    for (const { 0: key, 1: flag } of Object.entries(this.#record)) {
      returnObject[key] = (byteBag & flag) === flag;
    }

    super.incrementOffset(options);

    return returnObject as O;
  }

  writeUnaligned(
    value: O,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    let flags = 0;

    for (const { 0: key, 1: flagValue } of Object.entries(this.#record)) {
      if (value[key as keyof O]) {
        flags |= flagValue;
      }
    }

    dt.setUint16(options.byteOffset, flags);
    super.incrementOffset(options);
  }
}
