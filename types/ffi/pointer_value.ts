import type { AlignedType, TypeOptions } from "../types.ts";
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

  read(dataView: DataView, options: TypeOptions = {}): Deno.PointerValue {
    return Deno.UnsafePointer.create(
      this.pointerType.read(dataView, options),
    );
  }

  write(
    value: Deno.PointerValue,
    dataView: DataView,
    options: TypeOptions = {},
  ) {
    this.pointerType.write(
      Deno.UnsafePointer.value(value),
      dataView,
      options,
    );
  }
}

export const pointerValue = new PointerValue();
