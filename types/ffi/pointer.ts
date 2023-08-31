import type { AlignedType, SizedType, TypeOptions } from "../types.ts";
import { pointerView } from "./pointer_view.ts";

export class Pointer<T> implements AlignedType<T> {
  byteLength: number;
  byteAlign: number;
  type: SizedType<T>;
  pointerType: AlignedType<Deno.UnsafePointerView>;

  constructor(
    type: SizedType<T>,
    pointerType: AlignedType<Deno.UnsafePointerView> = pointerView,
  ) {
    this.byteAlign = pointerType.byteAlign;
    this.byteLength = pointerType.byteLength;
    this.type = type;
    this.pointerType = pointerType;
  }

  read(dataView: DataView, options: TypeOptions = {}): T {
    return this.type.read(
      new DataView(
        this.pointerType.read(dataView, options).getArrayBuffer(
          this.type.byteLength,
        ),
      ),
    );
  }

  write(value: T, dataView: DataView, options: TypeOptions = {}) {
    const buffer = new ArrayBuffer(this.type.byteLength);
    this.type.write(value, new DataView(buffer));
    const pointerView = new Deno.UnsafePointerView(
      Deno.UnsafePointer.of(buffer)!,
    );
    this.pointerType.write(pointerView, dataView, options);
  }
}
