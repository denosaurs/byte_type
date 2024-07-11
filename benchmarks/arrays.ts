import { ArrayType, SizedArrayType, u32 } from "../mod.ts";

for (let i = 2; i < 10; i++) {
    const codec = new ArrayType(u32, 1 << i);
    const sizedCodec = new SizedArrayType(u32, 1 << i);
    const data = new Array(1 << i).fill(0).map((_, i) => i);
    const buff = new Uint32Array(1 << i).fill(0).map((_, i) => i);
    const dt = new DataView(buff.buffer);

    Deno.bench({
        name: "Array (Read)",
        baseline: true,
        group: `read-${i}`,
        fn: () => {
            codec.readPacked(dt);
        },
    });

    Deno.bench({
        name: "Sized Array (Read)",
        group: `read-${i}`,
        fn: () => {
            sizedCodec.readPacked(dt);
        },
    });
    Deno.bench({
        name: "Array (Write)",
        baseline: true,
        group: `write-${i}`,
        fn: () => {
            codec.writePacked(data, dt);
        },
    });

    Deno.bench({
        name: "Sized Array (Write)",
        group: `write-${i}`,
        fn: () => {
            sizedCodec.writePacked(data, dt);
        },
    });
}
