import { type InnerType, Strings, Struct, u32, u8 } from "../mod.ts";
import {
  decode as msgpackRead,
  encode as msgpackWrite,
} from "jsr:@std/msgpack@0.218";
import { SizedStruct } from "../src/compound/sized_struct.ts";

const innerDescriptor = {
  name: new Strings.FixedLengthString(11),
  hp: u8,
  damage: u8,
  shield: u32,
};

const baseDescriptor = {
  handIndex: u8,
  fieldIndex: u8,
};

const descriptor = {
  ...baseDescriptor,
  card: new Struct(innerDescriptor),
};

const sizedDescriptor = {
  ...baseDescriptor,
  card: new SizedStruct(innerDescriptor),
};

const codec = new Struct(descriptor);
const sizedCodec = new SizedStruct(sizedDescriptor);

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

const ARRAY_BUFFER = new ArrayBuffer(20);
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
    codec.writePacked(data, DATA_VIEW);
  },
});

Deno.bench({
  name: "Struct (Read)",
  group: "read",
  fn: () => {
    codec.readPacked(DATA_VIEW);
  },
});

Deno.bench({
  name: "Struct (Roundtrip)",
  group: "roundtrip",
  fn: () => {
    codec.writePacked(data, DATA_VIEW);
    codec.readPacked(DATA_VIEW);
  },
});

Deno.bench({
  name: "SizedStruct (Write)",
  group: "write",
  fn: () => {
    sizedCodec.writePacked(data, DATA_VIEW);
  },
});

Deno.bench({
  name: "SizedStruct (Read)",
  group: "read",
  fn: () => {
    sizedCodec.readPacked(DATA_VIEW);
  },
});

Deno.bench({
  name: "SizedStruct (Roundtrip)",
  group: "roundtrip",
  fn: () => {
    sizedCodec.writePacked(data, DATA_VIEW);
    sizedCodec.readPacked(DATA_VIEW);
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
