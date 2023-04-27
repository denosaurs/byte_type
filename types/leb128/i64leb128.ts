import type { ReadOptions, Type, WriteOptions } from "../types.ts";
import { read, write } from "./_i64leb128.ts";

export class I64LEB128 implements Type<bigint> {
  read(dataView: DataView, options?: ReadOptions): bigint {
    options ??= {};
    options.byteOffset ??= 0;

    try {
      const [value, bytesRead] = read(
        new Uint8Array(
          dataView.buffer,
          dataView.byteOffset + options.byteOffset,
        ),
      );
      options.byteOffset += bytesRead;
      return value;
    } catch {
      throw new RangeError("I64LEB128 cannot exceed 64 bits in length");
    }
  }

  write(value: bigint, dataView: DataView, options?: WriteOptions): void {
    options ??= {};
    options.byteOffset ??= 0;

    const view = write(value);
    const writeView = new Uint8Array(
      dataView.buffer,
      dataView.byteOffset + options.byteOffset,
      dataView.byteLength,
    );
    writeView.set(view, 0);
    options.byteOffset += view.byteLength;
  }
}

export const i64leb128 = new I64LEB128();
