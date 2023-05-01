// Copyright 2023 the Blocktopus authors. All rights reserved. MIT license.
// Copyright 2023 the denosaurs team. All rights reserved. MIT license.

const bytes = Uint8Array.from(
  atob(
    "AGFzbQEAAAABDAJgAX8Cfn9gAX4BfwMDAgABBQMBAAEHGQMGbWVtb3J5AgAEcmVhZAAABXdyaXRlAAEKhAECQwEDfgJAA0AgADEAACIDQv8AgyAChiABhCEBIAJCB3wiAiADQoABg1ANASAAQQFqIQBCxgBUDQALAAsgASACQgeApws+AQF/AkADQCAAQoB/g1ANASABIABC/wCDQoABhDwAACAAQgeIIQAgAUEBaiEBDAALCyABIAA8AABBASABags=",
  ),
  (c) => c.charCodeAt(0),
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
