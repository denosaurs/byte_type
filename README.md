# byte_type

[![Tags](https://img.shields.io/github/release/denosaurs/byte_type)](https://github.com/denosaurs/byte_type/releases)
[![Checks](https://img.shields.io/github/actions/workflow/status/denosaurs/byte_type/checks.yml?branch=main)](https://github.com/denosaurs/byte_type/actions)
[![License](https://img.shields.io/github/license/denosaurs/byte_type)](https://github.com/denosaurs/byte_type/blob/master/LICENSE)

`byte_type` is a small helper module for efficiently working with different raw
types represented as a bunch of bytes. Now with performance being close to
native js performance and ergonomic interfaces!

## Usage

```ts
import { Struct, u32, u8 } from "https://deno.land/x/byte_type/mod.ts";

const buffer = new ArrayBuffer(8);
const dt = new DataView(buffer);

const struct = new Struct({ "b": u8, "a": u32 });

struct.write({ b: 8, a: 32 }, dt);
console.log(struct.read(dt));
console.log(buffer);

// Output:
// { b: 8, a: 32 }
// ArrayBuffer {
//   [Uint8Contents]: <08 00 00 00 20 00 00 00>,
//   byteLength: 8
// }
```

## Maintainers

- Elias Sjögreen ([@eliassjogreen](https://github.com/eliassjogreen))
- Dean ([@load1n9](https://github.com/load1n9))
- Skye ([@MierenManz](https://github.com/mierenmanz))

### Contribution

Pull request, issues and feedback are very welcome. Code style is formatted with
`deno fmt` and commit messages are done following Conventional Commits spec.

### Licence

Copyright 2021-2024, the denosaurs team. All rights reserved. MIT license.
