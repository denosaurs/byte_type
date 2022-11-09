import { AlignedType } from "../../types.ts";

export class I8 implements AlignedType<number> {
  byteLength = 1;
  byteAlign = 1;

  read(view: DataView, offset: number): number {
    return view.getInt8(offset);
  }

  write(view: DataView, offset: number, value: number) {
    view.setInt8(offset, value);
    return view.buffer;
  }
}

export const i8 = new I8();
