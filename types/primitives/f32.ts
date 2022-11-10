import { AlignedType } from "../../types.ts";
import { endianess } from "../../util.ts";

export class F32 implements AlignedType<number> {
  byteLength = 4;
  byteAlign = 4;
  endian;

  constructor(endian: boolean = endianess()) {
    this.endian = endian;
  }

  read(view: DataView, byteOffset: number): number {
    return view.getFloat32(byteOffset, this.endian);
  }

  write(view: DataView, byteOffset: number, value: number) {
    view.setFloat32(byteOffset, value, this.endian);
    return view.buffer;
  }
}

export const f32 = new F32();
export const f32le = new F32(true);
export const f32be = new F32(false);
