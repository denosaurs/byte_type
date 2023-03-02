import { AlignedType } from "../types.ts";
import { endianess } from "../../utils.ts";

export class U32 implements AlignedType<number> {
  byteLength = 4;
  byteAlign = 4;
  endian;

  constructor(endian: boolean = endianess) {
    this.endian = endian;
  }

  read(dataView: DataView, byteOffset = 0): number {
    return dataView.getUint32(byteOffset, this.endian);
  }

  write(value: number, dataView: DataView, byteOffset = 0) {
    if (dataView === undefined) {
      console.log("wtf");
    }
    dataView.setUint32(byteOffset, value, this.endian);
    return dataView.buffer;
  }
}

export const u32 = new U32();
export const u32le = new U32(true);
export const u32be = new U32(false);
