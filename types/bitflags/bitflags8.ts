import { SizedType, ViewableType } from "../types.ts";

export class BitFlags8<
  T extends Record<string, number>,
  V extends Record<string, boolean> = { [K in keyof T]: boolean },
> implements SizedType<V>, ViewableType<V> {
  byteLength = 1;
  flags: T;

  constructor(flags: T) {
    this.flags = flags;
  }

  read(dataView: DataView, byteOffset = 0): V {
    const flags = dataView.getUint8(byteOffset);
    const ret: Record<string, boolean> = {};

    for (const [key, flag] of Object.entries(this.flags)) {
      ret[key] = (flags & flag) === flag;
    }

    return ret as V;
  }

  write(value: V, dataView: DataView, byteOffset = 0) {
    let flags = 0;

    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) {
        flags |= this.flags[key];
      }
    }

    dataView.setUint8(byteOffset, flags);
  }

  view(dataView: DataView, byteOffset = 0): V {
    const object = {};

    Object.defineProperties(
      object,
      Object.fromEntries(
        Object.entries(this.flags).map(([key, flag]) => [key, {
          configurable: false,
          enumerable: true,

          get: () => {
            return (dataView.getUint8(byteOffset) & flag) === flag;
          },
          set: (value: boolean) => {
            dataView.setUint8(
              byteOffset,
              (dataView.getUint8(byteOffset) & 0) | Number(value),
            );
          },
        }]),
      ),
    );

    return object as unknown as V;
  }
}
