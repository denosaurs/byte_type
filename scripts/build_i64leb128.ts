import wabt from "wabt";

const { parseWat } = await wabt();

const source = "./types/leb128/_i64leb128.wat";
const destination = "./types/leb128/_i64leb128.ts";

const wat = await Deno.readTextFile(source);
const module = parseWat(source, wat);
const wasm = module.toBinary({}).buffer;
const encoded = btoa(String.fromCharCode(...wasm));

const content = `\
// Copyright 2023 the Blocktopus authors. All rights reserved. MIT license.
// Copyright 2023 the denosaurs team. All rights reserved. MIT license.

const bytes = Uint8Array.from(
  atob(
    "${encoded}"
  ),
  (c) => c.charCodeAt(0)
);
const { instance } = await WebAssembly.instantiate(bytes);

const exports = instance.exports as {
  memory: WebAssembly.Memory;
  read: (pointer: number) => [bigint, number];
  write: (value: bigint) => number;
};

const memory = new Uint8Array(exports.memory.buffer);

export function read(buffer: Uint8Array): [bigint, number] {
  memory.set(buffer, 0);
  return exports.read(0);
}

export function write(value: bigint): Uint8Array {
  return memory.subarray(0, exports.write(value));
}
`;

await Deno.writeTextFile(destination, content);
