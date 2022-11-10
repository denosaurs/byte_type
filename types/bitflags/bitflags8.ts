import { SizedType } from "../../types.ts";
import { endianess } from "../../util.ts";

export class BitFlags8<
  T extends Record<string, number>,
  V extends Record<string, boolean> = { [K in keyof T]: boolean },
> implements SizedType<V> {
  byteLength = 1;
  flags: T;

  constructor(flags: T) {
    this.flags = flags;
  }

  read(view: DataView, byteOffset: number): V {
    const flags = view.getUint8(byteOffset);
    const ret: Record<string, boolean> = {};

    for (const [key, flag] of Object.entries(this.flags)) {
      ret[key] = (flags & flag) === flag;
    }

    return ret as V;
  }

  write(view: DataView, byteOffset: number, value: V) {
    let flags = 0;

    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) {
        flags |= this.flags[key];
      }
    }

    view.setUint8(byteOffset, flags);
  }
}

export class BitFlags16<
  T extends Record<string, number>,
  V extends Record<string, boolean> = { [K in keyof T]: boolean },
> implements SizedType<V> {
  byteLength = 2;
  endian;
  flags: T;

  constructor(flags: T, endian: boolean = endianess()) {
    this.flags = flags;
    this.endian = endian;
  }

  read(view: DataView, byteOffset: number): V {
    const flags = view.getUint16(byteOffset, this.endian);
    const ret: Record<string, boolean> = {};

    for (const [key, flag] of Object.entries(this.flags)) {
      ret[key] = (flags & flag) === flag;
    }

    return ret as V;
  }

  write(view: DataView, byteOffset: number, value: V) {
    let flags = 0;

    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) {
        flags |= this.flags[key];
      }
    }

    view.setUint16(byteOffset, flags, this.endian);
  }
}

export class BitFlags32<
  T extends Record<string, number>,
  V extends Record<string, boolean> = { [K in keyof T]: boolean },
> implements SizedType<V> {
  byteLength = 4;
  endian;
  flags: T;

  constructor(flags: T, endian: boolean = endianess()) {
    this.flags = flags;
    this.endian = endian;
  }

  read(view: DataView, byteOffset: number): V {
    const flags = view.getUint32(byteOffset, this.endian);
    const ret: Record<string, boolean> = {};

    for (const [key, flag] of Object.entries(this.flags)) {
      ret[key] = (flags & flag) === flag;
    }

    return ret as V;
  }

  write(view: DataView, byteOffset: number, value: V) {
    let flags = 0;

    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) {
        flags |= this.flags[key];
      }
    }

    view.setUint32(byteOffset, flags, this.endian);
  }
}

export class BitFlags64<
  T extends Record<string, bigint>,
  V extends Record<string, boolean> = { [K in keyof T]: boolean },
> implements SizedType<V> {
  byteLength = 8;
  endian;
  flags: T;

  constructor(flags: T, endian: boolean = endianess()) {
    this.flags = flags;
    this.endian = endian;
  }

  read(view: DataView, byteOffset: number): V {
    const flags = view.getBigUint64(byteOffset, this.endian);
    const ret: Record<string, boolean> = {};

    for (const [key, flag] of Object.entries(this.flags)) {
      ret[key] = (flags & flag) === flag;
    }

    return ret as V;
  }

  write(view: DataView, byteOffset: number, value: V) {
    let flags = 0n;

    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) {
        flags |= this.flags[key];
      }
    }

    view.setBigUint64(byteOffset, flags, this.endian);
  }
}
