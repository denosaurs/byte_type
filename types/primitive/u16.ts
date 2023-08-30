import { AlignedType, TypeOptions } from "../types.ts";
import { endianess } from "../../utils.ts";

export class U16 implements AlignedType<number> {
  byteLength = 2;
  byteAlign = 2;
  endian;

  constructor(endian: boolean = endianess) {
    this.endian = endian;
  }

  read(dataView: DataView, options: TypeOptions = {}): number {
    options.byteOffset ??= 0;
    return dataView.getUint16(options.byteOffset, this.endian);
  }

  write(value: number, dataView: DataView, options: TypeOptions = {}) {
    options.byteOffset ??= 0;
    dataView.setUint16(options.byteOffset, value, this.endian);
    return dataView.buffer;
  }
}

export const u16 = new U16();
export const u16le = new U16(true);
export const u16be = new U16(false);
