import { AlignedType } from "../../types.ts";
import { endianess } from "../../util.ts";

export class U32 implements AlignedType<number> {
  byteLength = 4;
  byteAlign = 4;
  endian;

  constructor(endian: boolean = endianess()) {
    this.endian = endian;
  }

  read(view: DataView, offset: number): number {
    return view.getUint32(offset, this.endian);
  }

  write(view: DataView, offset: number, value: number) {
    view.setUint32(offset, value, this.endian);
    return view.buffer;
  }
}

export const u32 = new U32();
export const u32le = new U32(true);
export const u32be = new U32(false);
