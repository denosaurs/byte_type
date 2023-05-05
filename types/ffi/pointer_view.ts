import type { AlignedType } from "../types.ts";
import { pointerValue } from "./pointer_value.ts";

export class PointerView implements AlignedType<Deno.UnsafePointerView> {
  byteLength: number;
  byteAlign: number;
  pointerType: AlignedType<Deno.PointerValue>;

  constructor(
    pointerType: AlignedType<Deno.PointerValue> = pointerValue,
  ) {
    this.byteAlign = pointerType.byteAlign;
    this.byteLength = pointerType.byteLength;
    this.pointerType = pointerType;
  }

  read(dataView: DataView, byteOffset = 0): Deno.UnsafePointerView {
    return new Deno.UnsafePointerView(
      this.pointerType.read(dataView, byteOffset)!,
    );
  }

  write(value: Deno.UnsafePointerView, dataView: DataView, byteOffset = 0) {
    this.pointerType.write(value.pointer, dataView, byteOffset);
  }
}

export const pointerView = new PointerView();
