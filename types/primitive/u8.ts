import { AlignedType } from "../types.ts";

export class U8 implements AlignedType<number> {
  byteLength = 1;
  byteAlign = 1;

  read(dataView: DataView, byteOffset = 0): number {
    return dataView.getUint8(byteOffset);
  }

  write(value: number, dataView: DataView, byteOffset = 0) {
    dataView.setUint8(byteOffset, value);
    return dataView.buffer;
  }
}

export const u8 = new U8();
