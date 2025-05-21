import type { Options } from "./mod.ts";
import { SizedType } from "./types/mod.ts";

export class Offset extends SizedType<null> {
  override readonly maxSize: number | null;

  constructor(byteSize: number) {
    // Magic trick for flooring
    super(byteSize | 0, 1);
    this.maxSize = 0;
  }

  override readPacked(
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): null {
    if (
      this.byteSize + options.byteOffset < 0 ||
      this.byteSize + options.byteOffset >= dt.byteLength
    ) {
      throw new RangeError("Read goes out of bound.");
    }

    super.incrementOffset(options);
    return null;
  }

  override writePacked(
    _value: null,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    if (
      this.byteSize + options.byteOffset < 0 ||
      this.byteSize + options.byteOffset >= dt.byteLength
    ) {
      throw new RangeError("Write goes out of bound.");
    }

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
