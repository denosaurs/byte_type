import type { UnsizedType } from "./mod.ts";

/**
 * The endianess of your machine, true if little endian and false if big endian.
 */
export const isLittleEndian = (() => {
  const buffer = new ArrayBuffer(2);
  new DataView(buffer).setUint16(0, 256, true);
  return new Uint16Array(buffer)[0] === 256;
})();

export const align = (unaligned: number, alignment: number) =>
  (unaligned + alignment - 1) & ~(alignment - 1);

type ArrayOrRecord<T> = T[] | Record<string | number, T>;

export const getBiggestAlignment = (
  input: ArrayOrRecord<UnsizedType<unknown>>,
) =>
  Object.values(input)
    .reduce((acc, x) => Math.max(acc, x.byteAlignment), 0);
