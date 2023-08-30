import type { Type, TypeOptions } from "../types.ts";
import { read, write } from "./_i64leb128.ts";

export class I64LEB128 implements Type<bigint> {
  read(dataView: DataView, options: TypeOptions = {}): bigint {
    options.byteOffset ??= 0;
    try {
      const [value, _bytesRead] = read(
        new Uint8Array(
          dataView.buffer,
          dataView.byteOffset + options.byteOffset,
        ),
      );
      return value;
    } catch {
      throw new RangeError("I64LEB128 is too large");
    }
  }

  write(value: bigint, dataView: DataView, options: TypeOptions = {}): void {
    options.byteOffset ??= 0;
    const view = write(value);
    const writeView = new Uint8Array(
      dataView.buffer,
      dataView.byteOffset + options.byteOffset,
      dataView.byteLength,
    );
    writeView.set(view, 0);
  }
}

export const i64leb128 = new I64LEB128();
