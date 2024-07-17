import type { SizedType, UnsizedType } from "./mod.ts";

/**
 * The endianess of your machine, true if little endian and false if big endian.
 */
export const isLittleEndian: boolean = (() => {
  const buffer = new ArrayBuffer(2);
  new DataView(buffer).setUint16(0, 256, true);
  return new Uint16Array(buffer)[0] === 256;
})();

/** Align the value `unaligned` to the first integer that is divisible by `alignment` */
export const align = (unaligned: number, alignment: number): number =>
  (unaligned + alignment - 1) & ~(alignment - 1);

type ArrayOrRecord<T> = T[] | Record<string | number, T>;

/** Find and returns the biggest alignment out of a record / array of types */
export const getBiggestAlignment = (
  input: ArrayOrRecord<UnsizedType<unknown>>,
): number =>
  Object.values(input)
    .reduce((acc, x) => Math.max(acc, x.byteAlignment), 0);

export const calculateTotalSize = (
  input: ArrayOrRecord<SizedType<unknown>>,
): number =>
  Object.values(input)
    .reduce((acc, x) => acc + x.byteSize, 0);
