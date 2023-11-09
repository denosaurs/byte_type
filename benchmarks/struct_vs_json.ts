import { Struct, u8, TaggedUnion, cstring, InnerType } from "../mod.ts";


const descriptor = {
  handIndex: u8,
  fieldIndex: u8,
  card: new Struct({
    name: cstring,
    hp: u8,
    damage: u8,
    shield: u8
  }),
}
const codec = new TaggedUnion({
  0x00: new Struct(descriptor),
}, () => 0);

const byteTypeData: InnerType<typeof codec> = {
  handIndex: 255,
  fieldIndex: 255,
  card: {
    name: "InvalidCard",
    hp: 255,
    damage: 255,
    shield: 255
  }
};

const jsonData = {
  type: 0,
  ...byteTypeData
}

const jsonString = JSON.stringify(jsonData);

const ARRAY_BUFFER = new ArrayBuffer(20);
const DATA_VIEW = new DataView(ARRAY_BUFFER);

Deno.bench("nop", () => {});

Deno.bench({
  name: "Struct (Write)",
  group: "write",
  fn: () => {
    codec.write(byteTypeData, DATA_VIEW);
  }
});

Deno.bench({
  name: "Struct (Read)",
  group: "read",
  fn: () => {
    codec.read(DATA_VIEW);
  },
});

Deno.bench({
  name: "Struct (Roundtrip)",
  group: "roundtrip",
  fn: () => {
    codec.write(byteTypeData, DATA_VIEW);
    codec.read(DATA_VIEW);
  },
});


Deno.bench({
  name: "JSON (Write)",
  group: "write",
  baseline: true,
  fn: () => {
    JSON.stringify(jsonData);
  }
});

Deno.bench({
  name: "JSON (Read)",
  group: "read",
  baseline: true,
  fn: () => {
    JSON.parse(jsonString)
  }
});

Deno.bench({
  name: "JSON (Roundtrip)",
  group: "roundtrip",
  baseline: true,
  fn: () => {
    JSON.parse(
      JSON.stringify(jsonData)
    )
  }
})