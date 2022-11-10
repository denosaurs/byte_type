import { AlignedType } from "../../types.ts";

export class U8 implements AlignedType<number> {
  byteLength = 1;
  byteAlign = 1;

  read(view: DataView, byteOffset: number): number {
    return view.getUint8(byteOffset);
  }

  write(view: DataView, byteOffset: number, value: number) {
    view.setUint8(byteOffset, value);
    return view.buffer;
  }
}

export const u8 = new U8();
