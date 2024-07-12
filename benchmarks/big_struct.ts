import {
  type InnerType,
  SizedStruct,
  Strings,
  Struct,
  u32,
  u8,
} from "../mod.ts";
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

const object: InnerType<typeof codec> = {
  handIndex: 0,
  fieldIndex: 0,
  card: {
    name: "00000000000",
    hp: 0,
    damage: 0,
    shield: 0,
  },
};

const ARRAY_BUFFER = new ArrayBuffer(20);
const DATA_VIEW = new DataView(ARRAY_BUFFER);
const BIN_VIEW = new Uint8Array(ARRAY_BUFFER, 2, 11);
const DECODER = new TextDecoder();
const ENCODER = new TextEncoder();

Deno.bench("no-op", () => {});

Deno.bench({
  baseline: true,
  name: "object (Read)",
  group: "read",
  fn: () => {
    object.handIndex;
    object.fieldIndex;
    object.card.name;
    object.card.hp;
    object.card.damage;
    object.card.shield;
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
  name: "SizedStruct (Read)",
  group: "read",
  fn: () => {
    sizedCodec.readPacked(DATA_VIEW);
  },
});

Deno.bench({
  name: "Primitives (Read)",
  group: "read",
  fn: () => {
    DATA_VIEW.getUint8(0);
    DATA_VIEW.getUint8(1);
    DECODER.decode(BIN_VIEW);
    DATA_VIEW.getUint8(13);
    DATA_VIEW.getUint8(14);
    DATA_VIEW.getUint32(16);
  },
});

Deno.bench({
  baseline: true,
  name: "object (Write)",
  group: "write",
  fn: () => {
    object.handIndex = 255;
    object.fieldIndex = 255;
    object.card.name = "InvalidCards";
    object.card.hp = 255;
    object.card.damage = 255;
    object.card.shield = 255;
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
  name: "SizedStruct (Write)",
  group: "write",
  fn: () => {
    sizedCodec.writePacked(data, DATA_VIEW);
  },
});

Deno.bench({
  name: "Primitives (Write)",
  group: "write",
  fn: () => {
    DATA_VIEW.setUint8(0, 255);
    DATA_VIEW.setUint8(1, 255);
    ENCODER.encodeInto("InvalidCards", BIN_VIEW);
    DATA_VIEW.setUint8(13, 255);
    DATA_VIEW.setUint8(14, 255);
    DATA_VIEW.setUint32(16, 255);
  },
});
