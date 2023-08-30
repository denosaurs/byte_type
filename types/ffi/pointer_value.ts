import type { AlignedType } from "../types.ts";
import { u64 } from "../mod.ts";

export class PointerValue implements AlignedType<Deno.PointerValue> {
  byteLength: number;
  byteAlign: number;
  pointerType: AlignedType<number | bigint>;

  constructor(
    pointerType: AlignedType<number | bigint> = u64,
  ) {
    this.byteAlign = pointerType.byteAlign;
    this.byteLength = pointerType.byteLength;
    this.pointerType = pointerType;
  }

  read(dataView: DataView, byteOffset = 0): Deno.PointerValue {
    return Deno.UnsafePointer.create(
      this.pointerType.read(dataView, byteOffset),
    );
  }

  write(value: Deno.PointerValue, dataView: DataView, byteOffset = 0) {
    this.pointerType.write(
      Deno.UnsafePointer.value(value),
      dataView,
      byteOffset,
    );
  }
}

export const pointerValue = new PointerValue();
