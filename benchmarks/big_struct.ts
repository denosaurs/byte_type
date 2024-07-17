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

const ARRAY_BUFFER = new ArrayBuffer(20);
const DATA_VIEW = new DataView(ARRAY_BUFFER);
const BIN_VIEW = new Uint8Array(ARRAY_BUFFER, 2, 11);
const DECODER = new TextDecoder();
const ENCODER = new TextEncoder();

Deno.bench("no-op", () => {});

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
  baseline: true,
  fn: () => {
    ({
      handIndex: DATA_VIEW.getUint8(0),
      fieldIndex: DATA_VIEW.getUint8(1),
      card: {
        name: DECODER.decode(BIN_VIEW),
        hp: DATA_VIEW.getUint8(13),
        damage: DATA_VIEW.getUint8(14),
        shield: DATA_VIEW.getUint8(16),
      },
    });
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
    DATA_VIEW.setUint8(0, data.handIndex);
    DATA_VIEW.setUint8(1, data.fieldIndex);
    ENCODER.encodeInto(data.card.name, BIN_VIEW);
    DATA_VIEW.setUint8(13, data.card.hp);
    DATA_VIEW.setUint8(14, data.card.damage);
    DATA_VIEW.setUint32(16, data.card.shield);
  },
});
