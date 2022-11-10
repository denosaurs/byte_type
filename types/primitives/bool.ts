import { AlignedType } from "../../types.ts";

export class Bool implements AlignedType<boolean> {
  byteLength = 1;
  byteAlign = 1;

  read(view: DataView, byteOffset: number): boolean {
    return view.getInt8(byteOffset) === 1;
  }

  write(view: DataView, byteOffset: number, value: boolean) {
    view.setInt8(byteOffset, value ? 1 : 0);
    return view.buffer;
  }
}

export const bool = new Bool();
