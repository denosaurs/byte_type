import { AlignedType } from "../types.ts";
import { endianess } from "../../utils.ts";

export class Pointer<T> implements AlignedType<T> {
  byteLength;
  byteAlign;
  type;
  endian;
  bit64;

  constructor(type: AlignedType<T>, endian = endianess, bit64 = true) {
    this.type = type;
    this.endian = endian;
    this.bit64 = bit64;
    this.byteLength = bit64 ? 8 : 4;
    this.byteAlign = bit64 ? 8 : 4;
  }

  read(dataView: DataView, byteOffset = 0): T {
    const ptr = this.bit64
      ? dataView.getBigUint64(byteOffset, this.endian)
      : dataView.getUint32(byteOffset, this.endian);
    const view = new Deno.UnsafePointerView(Deno.UnsafePointer.create(ptr)!);
    const bufview = new DataView(view.getArrayBuffer(this.type.byteLength));
    return this.type.read(bufview);
  }

  write(value: T, dataView: DataView, byteOffset = 0) {
    const buffer = new ArrayBuffer(this.type.byteLength);
    this.type.write(value, new DataView(buffer));
    const ptr = Deno.UnsafePointer.value(Deno.UnsafePointer.of(buffer));
    this.bit64
      ? dataView.setBigUint64(byteOffset, ptr as bigint, this.endian)
      : dataView.setUint32(byteOffset, ptr as number, this.endian);
    return dataView.buffer;
  }
}
