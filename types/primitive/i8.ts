import { AlignedType, TypeOptions } from "../types.ts";

export class I8 implements AlignedType<number> {
  byteLength = 1;
  byteAlign = 1;

  read(dataView: DataView, options: TypeOptions = {}): number {
    options.byteOffset ??= 0;
    return dataView.getInt8(options.byteOffset);
  }

  write(value: number, dataView: DataView, options: TypeOptions = {}) {
    options.byteOffset ??= 0;
    dataView.setInt8(options.byteOffset, value);
    return dataView.buffer;
  }
}

export const i8 = new I8();
