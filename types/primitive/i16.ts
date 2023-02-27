import { AlignedType } from "../types.ts";
import { endianess } from "../../util.ts";

export class I16 implements AlignedType<number> {
  byteLength = 2;
  byteAlign = 2;
  endian;

  constructor(endian: boolean = endianess) {
    this.endian = endian;
  }

  read(dataView: DataView, byteOffset = 0): number {
    return dataView.getInt16(byteOffset, this.endian);
  }

  write(value: number, dataView: DataView, byteOffset = 0) {
    dataView.setInt16(byteOffset, value, this.endian);
    return dataView.buffer;
  }
}

export const i16 = new I16();
export const i16le = new I16(true);
export const i16be = new I16(false);
