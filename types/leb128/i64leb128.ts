import type { Type } from "../types.ts";
import { read, write } from "./_i64leb128.ts";

export class I64LEB128 implements Type<bigint> {
  read(dataView: DataView, byteOffset = 0): bigint {
    try {
      const [value, _bytesRead] = read(
        new Uint8Array(dataView.buffer, dataView.byteOffset + byteOffset),
      );
      return value;
    } catch {
      throw new RangeError("I64LEB128 is too large");
    }
  }

  write(value: bigint, dataView: DataView, byteOffset = 0): void {
    const view = write(value);
    const writeView = new Uint8Array(
      dataView.buffer,
      dataView.byteOffset + byteOffset,
      dataView.byteLength,
    );
    writeView.set(view, 0);
  }
}

export const i64leb128 = new I64LEB128();
