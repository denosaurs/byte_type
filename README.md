# byte_type

[![Tags](https://img.shields.io/github/release/denosaurs/byte_type)](https://github.com/denosaurs/byte_type/releases)
[![CI Status](https://img.shields.io/github/workflow/status/denosaurs/byte_type/check)](https://github.com/denosaurs/byte_type/actions)
[![Dependencies](https://img.shields.io/github/workflow/status/denosaurs/byte_type/depsbot?label=dependencies)](https://github.com/denosaurs/depsbot)
[![License](https://img.shields.io/github/license/denosaurs/byte_type)](https://github.com/denosaurs/byte_type/blob/master/LICENSE)

`byte_type` is a small helper module for working with different raw types
represented as a bunch of bytes.

## Usage

```ts
import { PackedStruct } from "https://deno.land/x/byte_type/types/structs/mod.ts";
import { u32, u8 } from "https://deno.land/x/byte_type/types/primitives/mod.ts";

const o = new PackedStruct({ "b": u8, "a": u32 }).object(
  new DataView(new ArrayBuffer(5)),
  0,
);

console.log(o.valueOf());
```

## Maintainers

- Elias Sjögreen ([@eliassjogreen](https://github.com/eliassjogreen))
- Loading ([@load1n9](https://github.com/load1n9))

### Contribution

Pull request, issues and feedback are very welcome. Code style is formatted with
`deno fmt` and commit messages are done following Conventional Commits spec.

### Licence

Copyright 2021, the denosaurs team. All rights reserved. MIT license.
