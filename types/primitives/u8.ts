import { AlignedType } from "../../types.ts";

export class U8 implements AlignedType<number> {
  byteLength = 1;
  byteAlign = 1;

  read(view: DataView, offset: number): number {
    return view.getUint8(offset);
  }

  write(view: DataView, offset: number, value: number) {
    view.setUint8(offset, value);
    return view.buffer;
  }
}

export const u8 = new U8();
