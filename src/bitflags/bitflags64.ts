import { type Options, SizedType } from "../types/mod.ts";
import type { OutputRecord } from "./_common.ts";

export class BitFlags64<
  I extends Record<string, bigint>,
  O = OutputRecord<I>,
> extends SizedType<O> {
  #recordEntries: Array<[string, bigint]>;

  constructor(record: I) {
    super(8, 8);
    this.#recordEntries = Object.entries(record);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): O {
    const returnObject: Record<string, boolean> = {};

    const byteBag = dt.getBigUint64(options.byteOffset);
    for (const { 0: key, 1: flag } of this.#recordEntries) {
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
    let flags = 0n;

    for (const { 0: key, 1: flagValue } of this.#recordEntries) {
      if (value[key as keyof O]) {
        flags |= flagValue;
      }
    }

    dt.setBigUint64(options.byteOffset, flags);
    super.incrementOffset(options);
  }
}
