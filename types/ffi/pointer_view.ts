import type { AlignedType, TypeOptions } from "../types.ts";
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

  read(dataView: DataView, options: TypeOptions = {}): Deno.UnsafePointerView {
    return new Deno.UnsafePointerView(
      this.pointerType.read(dataView, options)!,
    );
  }

  write(
    value: Deno.UnsafePointerView,
    dataView: DataView,
    options: TypeOptions = {},
  ) {
    this.pointerType.write(value.pointer, dataView, options);
  }
}

export const pointerView = new PointerView();
