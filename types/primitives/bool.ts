import { AlignedType } from "../../types.ts";

export class Bool implements AlignedType<boolean> {
  byteLength = 1;
  byteAlign = 1;

  read(view: DataView, offset: number): boolean {
    return view.getInt8(offset) === 1;
  }

  write(view: DataView, offset: number, value: boolean) {
    view.setInt8(offset, value ? 1 : 0);
    return view.buffer;
  }
}

export const bool = new Bool();
