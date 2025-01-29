import { calculateTotalSize, getBiggestAlignment } from "../util.ts";
import { type InnerType, type Options, SizedType } from "../types/mod.ts";
import { Struct } from "./mod.ts";

type ReadFn<R> = (dt: DataView, options: Options) => R;
type WriteFn<V> = (value: V, dt: DataView, options: Options) => void;

const createRead = (key: string, method: string) =>
  `"${key}": ${key}.${method}(dt, options)`;

const createWrite = (key: string, method: string) =>
  `${key}.${method}(value.${key}, dt, options);`;

function createReadMethod<V>(
  input: Record<string, SizedType<unknown>>,
  isPacked: boolean,
): ReadFn<V> {
  const method = isPacked ? "readPacked" : "read";
  const keys = Object.keys(input);

  const generatedCodec = keys.map((k) => createRead(k, method));

  const body = `const { ${keys} } = this;\nreturn { ${generatedCodec} }`;

  return Function("dt", "options", body).bind(input);
}

function createWriteMethod<V>(
  input: Record<string, SizedType<unknown>>,
  isPacked: boolean,
): WriteFn<V> {
  const method = isPacked ? "writePacked" : "write";
  const keys = Object.keys(input);

  const generatedCodec = keys.map((k) => createWrite(k, method));

  const body = `const { ${keys} } = this;\nreturn { ${generatedCodec} }`;
  return Function("value", "dt", "options", body).bind(input);
}

export class SizedStruct<
  T extends Record<string, SizedType<unknown>>,
  V extends { [K in keyof T]: InnerType<T[K]> } = {
    [K in keyof T]: InnerType<T[K]>;
  },
> // Omit here to make typescript shut up about 2720. Maybe a bug.
  extends SizedType<V>
  implements Omit<Struct<T, V>, "#record"> {
  #inner: Partial<Struct<T, V>>;

  constructor(input: T, jitEnabled: boolean = true) {
    super(calculateTotalSize(input), getBiggestAlignment(input));
    if (jitEnabled) {
      this.#inner = {
        read: createReadMethod(input, false),
        readPacked: createReadMethod(input, true),
        write: createWriteMethod(input, false),
        writePacked: createWriteMethod(input, false),
      };
    } else {
      this.#inner = new Struct(input);
    }
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): V {
    return this.#inner.readPacked!(dt, options);
  }

  override read(dt: DataView, options: Options = { byteOffset: 0 }): V {
    return this.#inner.read!(dt, options);
  }

  writePacked(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    this.#inner.writePacked!(value, dt, options);
  }

  override write(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    this.#inner.write!(value, dt, options);
  }
}
