import { String } from "../mod.ts";

const stringThing = new String.FixedLength(12);

const ab = new TextEncoder().encode("Hello World!").buffer;
const dt = new DataView(ab);

Deno.bench("no-op", () => {});

Deno.bench({
  name: "Read",
  fn: () => {
    stringThing.read(dt);
  },
});

Deno.bench({
  name: "Write",
  fn: () => {
    stringThing.write("hello world!", dt);
  },
});
