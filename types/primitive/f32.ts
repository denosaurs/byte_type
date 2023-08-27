import { AlignedType, TypeOptions } from "../types.ts";
import { endianess } from "../../utils.ts";

export class F32 implements AlignedType<number> {
  byteLength = 4;
  byteAlign = 4;
  endian;

  constructor(endian: boolean = endianess) {
    this.endian = endian;
  }

  read(dataView: DataView, options: TypeOptions = {}): number {
    options.byteOffset ??= 0;
    return dataView.getFloat32(options.byteOffset, this.endian);
  }

  write(value: number, dataView: DataView, options: TypeOptions = {}) {
    options.byteOffset ??= 0;
    dataView.setFloat32(options.byteOffset, value, this.endian);
    return dataView.buffer;
  }
}

export const f32 = new F32();
export const f32le = new F32(true);
export const f32be = new F32(false);
