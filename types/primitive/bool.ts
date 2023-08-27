import { AlignedType, TypeOptions } from "../types.ts";

export class Bool implements AlignedType<boolean> {
  byteLength = 1;
  byteAlign = 1;

  read(dataView: DataView, options: TypeOptions = {}): boolean {
    options.byteOffset ??= 0;
    return dataView.getInt8(options.byteOffset) === 1;
  }

  write(value: boolean, dataView: DataView, options: TypeOptions = {}) {
    options.byteOffset ??= 0;
    dataView.setInt8(options.byteOffset, value ? 1 : 0);
    return dataView.buffer;
  }
}

export const bool = new Bool();
