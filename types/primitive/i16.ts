import { AlignedType, TypeOptions } from "../types.ts";
import { endianess } from "../../utils.ts";

export class I16 implements AlignedType<number> {
  byteLength = 2;
  byteAlign = 2;
  endian;

  constructor(endian: boolean = endianess) {
    this.endian = endian;
  }

  read(dataView: DataView, options: TypeOptions = {}): number {
    options.byteOffset ??= 0;
    return dataView.getInt16(options.byteOffset, this.endian);
  }

  write(value: number, dataView: DataView, options: TypeOptions = {}) {
    options.byteOffset ??= 0;
    dataView.setInt16(options.byteOffset, value, this.endian);
    return dataView.buffer;
  }
}

export const i16 = new I16();
export const i16le = new I16(true);
export const i16be = new I16(false);
