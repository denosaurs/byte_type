import { type InnerType, type Options, SizedType } from "../mod.ts";
import { calculateTotalSize, getBiggestAlignment } from "../util.ts";

type ReadFn<R> = (dt: DataView, options: Options) => R;
type WriteFn<V> = (dt: DataView, options: Options, value: V) => void;

const createRead = (key: string, method: string) =>
  `"${key}": ${key}.${method}(dt, options)`;

const createWrite = (key: string, method: string) =>
  `${key}.${method}(value.${key}, dt, options);`;

function createFunc<V, M extends `read${string}`>(
  input: Record<string, SizedType<unknown>>,
  method: M,
): ReadFn<V>;
function createFunc<V, M extends `write${string}`>(
  input: Record<string, SizedType<unknown>>,
  method: M,
): WriteFn<V>;
function createFunc<V>(
  input: Record<string, SizedType<unknown>>,
  method: string,
): WriteFn<V> | ReadFn<V> {
  const isWriter = method.startsWith("write");
  const seperator = !isWriter ? "," : "";
  const keys = Object.keys(input);

  const mapFn = isWriter ? createWrite : createRead;

  const generatedCodec = keys.map((k) => mapFn(k, method)).join(seperator);
  const args = ["dt", "options"];
  let body = `const { ${keys} } = this;`;

  if (!isWriter) {
    body += `return {${generatedCodec}}`;
  } else {
    body += `${generatedCodec}`;
    args.push("value");
  }

  args.push(body);
  return Function(...args).bind(input) as WriteFn<V> | ReadFn<V>;
}

export class SizedStruct<
  T extends Record<string, SizedType<unknown>>,
  V extends { [K in keyof T]: InnerType<T[K]> } = {
    [K in keyof T]: InnerType<T[K]>;
  },
> extends SizedType<V> {
  #readPacked: ReadFn<V>;
  #read: ReadFn<V>;
  #writePacked: WriteFn<V>;
  #write: WriteFn<V>;

  constructor(input: T) {
    super(calculateTotalSize(input), getBiggestAlignment(input));
    this.#readPacked = createFunc(input, "readPacked");
    this.#read = createFunc(input, "read");
    this.#writePacked = createFunc(input, "writePacked");
    this.#write = createFunc(input, "write");
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): V {
    return this.#readPacked(dt, options);
  }

  override read(dt: DataView, options: Options = { byteOffset: 0 }): V {
    return this.#read(dt, options);
  }

  writePacked(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    this.#writePacked(dt, options, value);
  }

  override write(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    this.#write(dt, options, value);
  }
}
