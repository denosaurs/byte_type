import { AlignedType } from "../types.ts";

export class I8 implements AlignedType<number> {
  byteLength = 1;
  byteAlign = 1;

  read(dataView: DataView, byteOffset = 0): number {
    return dataView.getInt8(byteOffset);
  }

  write(value: number, dataView: DataView, byteOffset = 0) {
    dataView.setInt8(byteOffset, value);
    return dataView.buffer;
  }
}

export const i8 = new I8();
