import { SizedType, TypeOptions, ViewableType } from "../types.ts";

export class BitFlags32<
  T extends Record<string, number>,
  V extends Record<string, boolean> = { [K in keyof T]: boolean },
> implements SizedType<V>, ViewableType<V> {
  byteLength = 4;
  flags: T;

  constructor(flags: T) {
    this.flags = flags;
  }

  read(dataView: DataView, options: TypeOptions = {}): V {
    options.byteOffset ??= 0;
    const flags = dataView.getUint32(options.byteOffset);
    const ret: Record<string, boolean> = {};

    for (const [key, flag] of Object.entries(this.flags)) {
      ret[key] = (flags & flag) === flag;
    }

    return ret as V;
  }

  write(value: V, dataView: DataView, options: TypeOptions = {}) {
    options.byteOffset ??= 0;
    let flags = 0;

    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) {
        flags |= this.flags[key];
      }
    }

    dataView.setUint32(options.byteOffset, flags);
  }

  view(dataView: DataView, options: TypeOptions = {}): V {
    options.byteOffset ??= 0;
    const object = {};

    Object.defineProperties(
      object,
      Object.fromEntries(
        Object.entries(this.flags).map(([key, flag]) => [key, {
          configurable: false,
          enumerable: true,

          get: () => {
            return (dataView.getUint32(options.byteOffset!) & flag) === flag;
          },
          set: (value: boolean) => {
            dataView.setUint32(
              options.byteOffset!,
              (dataView.getUint32(options.byteOffset!) & 0) | Number(value),
            );
          },
        }]),
      ),
    );

    return object as unknown as V;
  }
}
