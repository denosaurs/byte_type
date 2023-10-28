/**
 * The endianess of your machine, true if little endian and false if big endian.
 */
export const isLittleEndian = (() => {
  const buffer = new ArrayBuffer(2);
  new DataView(buffer).setUint16(0, 256, true);
  return new Uint16Array(buffer)[0] === 256;
})();

export const align = (byteSize: number, alignment: number) =>
  (byteSize + alignment - 1) & ~(alignment - 1);
