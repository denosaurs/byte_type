// Copyright 2023 the Blocktopus authors. All rights reserved. MIT license.
// deno-fmt-ignore
const WASM_BINARY_STRING = "AGFzbQEAAAABDAJgAX8Cfn9gAX4BfwMDAgABBQMBAAEHJAMDbWVtAgALcmVhZFZhckxvbmcAAAx3cml0ZVZhckxvbmcAAQqEAQJDAQN+AkADQCAAMQAAIgNC/wCDIAKGIAGEIQEgAkIHfCICIANCgAGDUA0BIABBAWohAELGAFQNAAsACyABIAJCB4CnCz4BAX8CQANAIABCgH+DUA0BIAEgAEL/AINCgAGEPAAAIABCB4ghACABQQFqIQEMAAsLIAEgADwAAEEBIAFqCw=="
const WASM_BYTES = Uint8Array.from(
  atob(WASM_BINARY_STRING),
  (c) => c.charCodeAt(0),
);
const { instance } = await WebAssembly.instantiate(WASM_BYTES);

const WASM_EXPORTS = instance.exports as {
  mem: WebAssembly.Memory;
  readVarLong: (ptr: number) => [bigint, number];
  writeVarLong: (val: bigint) => number;
};

const WASM_MEMORY = new Uint8Array(WASM_EXPORTS.mem.buffer);

export function readVarLong(buffer: Uint8Array): [bigint, number] {
  WASM_MEMORY.set(buffer, 0);
  return WASM_EXPORTS.readVarLong(0);
}

export function writeVarLong(value: bigint): Uint8Array {
  return WASM_MEMORY.subarray(0, WASM_EXPORTS.writeVarLong(value));
}
