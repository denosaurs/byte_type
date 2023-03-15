# byte_type

[![Tags](https://img.shields.io/github/release/denosaurs/byte_type)](https://github.com/denosaurs/byte_type/releases)
[![Checks](https://img.shields.io/github/actions/workflow/status/denosaurs/byte_type/checks.yml?branch=main)](https://github.com/denosaurs/byte_type/actions)
[![License](https://img.shields.io/github/license/denosaurs/byte_type)](https://github.com/denosaurs/byte_type/blob/master/LICENSE)

`byte_type` is a small helper module for efficiently working with different raw
types represented as a bunch of bytes. Now with performance being close to
native js performance and ergonomic interfaces!

## Usage

```ts
import { PackedStruct, u32, u8 } from "https://deno.land/x/byte_type/mod.ts";

const o = new PackedStruct({ "b": u8, "a": u32 }).view(
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

Copyright 2021-2023, the denosaurs team. All rights reserved. MIT license.
