import { AlignedType } from "../../types.ts";
import { endianess } from "../../util.ts";

export class U16 implements AlignedType<number> {
  byteLength = 2;
  byteAlign = 2;
  endian;

  constructor(endian: boolean = endianess()) {
    this.endian = endian;
  }

  read(view: DataView, offset: number): number {
    return view.getUint16(offset, this.endian);
  }

  write(view: DataView, offset: number, value: number) {
    view.setUint16(offset, value, this.endian);
    return view.buffer;
  }
}

export const u16 = new U16();
export const u16le = new U16(true);
export const u16be = new U16(false);
