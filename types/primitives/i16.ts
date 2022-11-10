import { AlignedType } from "../../types.ts";
import { endianess } from "../../util.ts";

export class I16 implements AlignedType<number> {
  byteLength = 2;
  byteAlign = 2;
  endian;

  constructor(endian: boolean = endianess()) {
    this.endian = endian;
  }

  read(view: DataView, byteOffset: number): number {
    return view.getInt16(byteOffset, this.endian);
  }

  write(view: DataView, byteOffset: number, value: number) {
    view.setInt16(byteOffset, value, this.endian);
    return view.buffer;
  }
}

export const i16 = new I16();
export const i16le = new I16(true);
export const i16be = new I16(false);
