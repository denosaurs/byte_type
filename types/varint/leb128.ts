import type { Type } from "../types.ts";
import { readVarLong, writeVarLong } from "./_varlong.ts";

export class I64LEB128 implements Type<bigint> {
  read(dataView: DataView, byteOffset = 0): bigint {
    try {
      const [value, _bytesRead] = readVarLong(
        new Uint8Array(dataView.buffer, dataView.byteOffset + byteOffset),
      );
      return value;
    } catch {
      throw new TypeError("VarLong is too big");
    }
  }

  write(value: bigint, dataView: DataView, byteOffset = 0): void {
    const view = writeVarLong(value);
    const writeView = new Uint8Array(
      dataView.buffer,
      dataView.byteOffset + byteOffset,
      dataView.byteLength,
    );
    writeView.set(view, 0);
  }
}
