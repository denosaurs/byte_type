import type { Options } from "./mod.ts";
import { SizedType } from "./types/mod.ts";

export class Offset extends SizedType<null> {
  constructor(byteSize: number) {
    // Magic trick for flooring
    super(byteSize | 0, 1);
  }

  override readPacked(
    _dt: DataView,
    options: Options = { byteOffset: 0 },
  ): null {
    super.incrementOffset(options);
    return null;
  }

  override writePacked(
    _value: null,
    _dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    super.incrementOffset(options);
  }
}

export class Skip extends Offset {
  constructor(byteSize: number) {
    super(Math.abs(byteSize));
  }
}

export class Reverse extends Offset {
  constructor(byteSize: number) {
    super(-Math.abs(byteSize));
  }
}
