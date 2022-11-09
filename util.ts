/**
 * Checks the endianess of your machine, returns true
 * if little endian and false if big endian.
 */
export function endianess(): boolean {
  const buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, 256, true);
  return new Int16Array(buffer)[0] === 256;
}
