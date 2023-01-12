import { AlignedType } from "../types.ts";
import { endianess } from "../../util.ts";

export class I32 implements AlignedType<number> {
  byteLength = 4;
  byteAlign = 4;
  endian;

  constructor(endian: boolean = endianess()) {
    this.endian = endian;
  }

  read(dataView: DataView, byteOffset = 0): number {
    return dataView.getInt32(byteOffset, this.endian);
  }

  write(value: number, dataView: DataView, byteOffset = 0) {
    dataView.setInt32(byteOffset, value, this.endian);
    return dataView.buffer;
  }
}

export const i32 = new I32();
export const i32le = new I32(true);
export const i32be = new I32(false);
