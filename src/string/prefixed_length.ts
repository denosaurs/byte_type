import { u8, UnsizedType } from "../mod.ts";
import type { Options } from "../types/mod.ts";
import { TEXT_DECODER, TEXT_ENCODER } from "./_common.ts";

export class PrefixedString extends UnsizedType<string> {
  #prefixCodec: UnsizedType<number>;

  constructor(prefixCodec: UnsizedType<number> = u8) {
    super(1);
    this.#prefixCodec = prefixCodec;
  }

  writePacked(
    value: string,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    this.#prefixCodec.writePacked(value.length, dt, options);

    const view = new Uint8Array(
      dt.buffer,
      dt.byteOffset + options.byteOffset,
      value.length,
    );

    TEXT_ENCODER.encodeInto(value, view);
    super.incrementOffset(options, value.length);
  }

  override write(
    value: string,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    this.#prefixCodec.write(value.length, dt, options);
    super.alignOffset(options);

    const view = new Uint8Array(
      dt.buffer,
      dt.byteLength + options.byteOffset,
      value.length,
    );

    TEXT_ENCODER.encodeInto(value, view);
    super.incrementOffset(options, value.length);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): string {
    const length = this.#prefixCodec.readPacked(dt, options);
    const view = new Uint8Array(
      dt.buffer,
      dt.byteOffset + options.byteOffset,
      length,
    );

    super.incrementOffset(options, length);
    return TEXT_DECODER.decode(view);
  }

  override read(dt: DataView, options: Options = { byteOffset: 0 }): string {
    const length = this.#prefixCodec.read(dt, options);
    super.alignOffset(options);

    const view = new Uint8Array(
      dt.buffer,
      dt.byteOffset + options.byteOffset,
      length,
    );

    super.incrementOffset(options, length);
    return TEXT_DECODER.decode(view);
  }
}
