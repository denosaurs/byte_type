import { AlignedType } from "../../types.ts";
import { endianess } from "../../util.ts";

export class U64 implements AlignedType<bigint> {
  byteLength = 8;
  byteAlign = 8;
  endian;

  constructor(endian: boolean = endianess()) {
    this.endian = endian;
  }

  read(view: DataView, offset: number): bigint {
    return view.getBigUint64(offset, this.endian);
  }

  write(view: DataView, offset: number, value: bigint) {
    view.setBigUint64(offset, value, this.endian);
    return view.buffer;
  }
}

export const u64 = new U64();
export const u64le = new U64(true);
export const u64be = new U64(false);
