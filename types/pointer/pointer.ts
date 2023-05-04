import { AlignedType } from "../types.ts";
import { endianess } from "../../utils.ts";

export class Pointer<T> implements AlignedType<T> {
  byteLength = 8;
  byteAlign = 8;
  type;
  endian;

  constructor(type: AlignedType<T>, endian = endianess) {
    this.type = type;
    this.endian = endian;
  }

  read(dataView: DataView, byteOffset = 0): T {
    const ptr = dataView.getBigUint64(byteOffset, this.endian);
    const view = new Deno.UnsafePointerView(Deno.UnsafePointer.create(ptr)!);
    const bufview = new DataView(view.getArrayBuffer(this.type.byteLength));
    return this.type.read(bufview);
  }

  write(value: T, dataView: DataView, byteOffset = 0) {
    const buffer = new ArrayBuffer(this.type.byteLength);
    this.type.write(value, new DataView(buffer))
    const ptr = Deno.UnsafePointer.value(Deno.UnsafePointer.of(buffer));
    dataView.setBigUint64(byteOffset, BigInt(ptr), this.endian);
    return dataView.buffer;
  }
}

export const pointer = <T>(type: AlignedType<T>) => new Pointer(type);