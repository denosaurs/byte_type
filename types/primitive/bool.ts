import { AlignedType } from "../types.ts";

export class Bool implements AlignedType<boolean> {
  byteLength = 1;
  byteAlign = 1;

  read(dataView: DataView, byteOffset = 0): boolean {
    return dataView.getInt8(byteOffset) === 1;
  }

  write(value: boolean, dataView: DataView, byteOffset = 0) {
    dataView.setInt8(byteOffset, value ? 1 : 0);
    return dataView.buffer;
  }
}

export const bool = new Bool();
