import { cstring, InnerType, Struct, u32, u8 } from "../mod.ts";
import {
  decode as msgpackRead,
  encode as msgpackWrite,
} from "std/msgpack/mod.ts";

const descriptor = {
  handIndex: u8,
  fieldIndex: u8,
  card: new Struct({
    name: cstring,
    hp: u8,
    damage: u8,
    shield: u32,
  }),
};

const codec = new Struct(descriptor);

const data: InnerType<typeof codec> = {
  handIndex: 255,
  fieldIndex: 255,
  card: {
    name: "InvalidCard",
    hp: 255,
    damage: 255,
    shield: 255,
  },
};

const jsonString = JSON.stringify(data);
const msgPackBuff = msgpackWrite(data);

const ARRAY_BUFFER = new ArrayBuffer(30);
const DATA_VIEW = new DataView(ARRAY_BUFFER);

Deno.bench("nop", () => {});

Deno.bench({
  name: "JSON (Write)",
  group: "write",
  baseline: true,
  fn: () => {
    JSON.stringify(data);
  },
});

Deno.bench({
  name: "JSON (Read)",
  group: "read",
  baseline: true,
  fn: () => {
    JSON.parse(jsonString);
  },
});

Deno.bench({
  name: "JSON (Roundtrip)",
  group: "roundtrip",
  baseline: true,
  fn: () => {
    JSON.stringify(data);
    JSON.parse(jsonString);
  },
});

Deno.bench({
  name: "Struct (Write)",
  group: "write",
  fn: () => {
    codec.writeUnaligned(data, DATA_VIEW);
  },
});

Deno.bench({
  name: "Struct (Read)",
  group: "read",
  fn: () => {
    codec.readUnaligned(DATA_VIEW);
  },
});

Deno.bench({
  name: "Struct (Roundtrip)",
  group: "roundtrip",
  fn: () => {
    codec.writeUnaligned(data, DATA_VIEW);
    codec.readUnaligned(DATA_VIEW);
  },
});

Deno.bench({
  name: "MsgPack (Write)",
  group: "write",
  fn: () => {
    msgpackWrite(data);
  },
});

Deno.bench({
  name: "MsgPack (Read)",
  group: "read",
  fn: () => {
    msgpackRead(msgPackBuff);
  },
});

Deno.bench({
  name: "MsgPack (Roundtrip)",
  group: "roundtrip",
  fn: () => {
    msgpackWrite(data);
    msgpackRead(msgPackBuff);
  },
});
