import { AlignedType } from "../../types.ts";
import { endianess } from "../../util.ts";

export class I64 implements AlignedType<bigint> {
  byteLength = 8;
  byteAlign = 8;
  endian;

  constructor(endian: boolean = endianess()) {
    this.endian = endian;
  }

  read(view: DataView, offset: number): bigint {
    return view.getBigInt64(offset, this.endian);
  }

  write(view: DataView, offset: number, value: bigint) {
    view.setBigInt64(offset, value, this.endian);
    return view.buffer;
  }
}

export const i64 = new I64();
export const i64le = new I64(true);
export const i64be = new I64(false);
