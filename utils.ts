const buffer = new ArrayBuffer(2);
new DataView(buffer).setInt16(0, 256, true);

/**
 * The endianess of your machine, true if little endian and false if big endian.
 */
export const endianess = new Int16Array(buffer)[0] === 256;
