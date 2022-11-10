import { AlignedType } from "../../types.ts";

export class I8 implements AlignedType<number> {
  byteLength = 1;
  byteAlign = 1;

  read(view: DataView, byteOffset: number): number {
    return view.getInt8(byteOffset);
  }

  write(view: DataView, byteOffset: number, value: number) {
    view.setInt8(byteOffset, value);
    return view.buffer;
  }
}

export const i8 = new I8();
