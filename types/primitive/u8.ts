import { AlignedType, TypeOptions } from "../types.ts";

export class U8 implements AlignedType<number> {
  byteLength = 1;
  byteAlign = 1;

  read(dataView: DataView, options: TypeOptions = {}): number {
    options.byteOffset ??= 0;
    return dataView.getUint8(options.byteOffset);
  }

  write(value: number, dataView: DataView, options: TypeOptions = {}) {
    options.byteOffset ??= 0;
    dataView.setUint8(options.byteOffset, value);
    return dataView.buffer;
  }
}

export const u8 = new U8();
