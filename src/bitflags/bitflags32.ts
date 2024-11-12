import { type Options, SizedType } from "../types/mod.ts";
import type { OutputRecord } from "./_common.ts";

export class BitFlags32<
  I extends Record<string, number>,
  O = OutputRecord<I>,
> extends SizedType<O> {
  #recordEntries: Array<[string, number]>;

  constructor(record: I) {
    super(4, 4);
    this.#recordEntries = Object.entries(record);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): O {
    const returnObject: Record<string, boolean> = {};

    const byteBag = dt.getUint32(options.byteOffset);
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
    let flags = 0;

    for (const { 0: key, 1: flagValue } of this.#recordEntries) {
      if (value[key as keyof O]) {
        flags |= flagValue;
      }
    }

    dt.setUint32(options.byteOffset, flags);
    super.incrementOffset(options);
  }
}
