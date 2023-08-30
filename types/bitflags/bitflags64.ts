import { SizedType, TypeOptions, ViewableType } from "../types.ts";

export class BitFlags64<
  T extends Record<string, bigint>,
  V extends Record<string, boolean> = { [K in keyof T]: boolean },
> implements SizedType<V>, ViewableType<V> {
  byteLength = 8;
  flags: T;

  constructor(flags: T) {
    this.flags = flags;
  }

  read(dataView: DataView, options: TypeOptions = {}): V {
    options.byteOffset ??= 0;
    const flags = dataView.getBigUint64(options.byteOffset);
    const ret: Record<string, boolean> = {};

    for (const [key, flag] of Object.entries(this.flags)) {
      ret[key] = (flags & flag) === flag;
    }

    return ret as V;
  }

  write(value: V, dataView: DataView, options: TypeOptions = {}) {
    options.byteOffset ??= 0;
    let flags = 0n;

    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) {
        flags |= this.flags[key];
      }
    }

    dataView.setBigUint64(options.byteOffset, flags);
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
            return (dataView.getBigUint64(options.byteOffset!) & flag) === flag;
          },
          set: (value: boolean) => {
            dataView.setBigUint64(
              options.byteOffset!,
              (dataView.getBigUint64(options.byteOffset!) & 0n) | BigInt(value),
            );
          },
        }]),
      ),
    );

    return object as unknown as V;
  }
}
