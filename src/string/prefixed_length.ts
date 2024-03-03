import { UnsizedType, u8 } from "../mod.ts";
import { Options } from "../types/_common.ts";
import { TEXT_DECODER, TEXT_ENCODER } from "./_common.ts";

export class PrefixedLengthString extends UnsizedType<string> {
  #prefixCodec: UnsizedType<number>;

  constructor(prefixCodec: UnsizedType<number> = u8) {
    super(1);
    this.#prefixCodec = prefixCodec;
  }

  writePacked(value: string, dt: DataView, options: Options = { byteOffset: 0 }): void {
    this.#prefixCodec.writePacked(value.length, dt, options);

    const view = new Uint8Array(
      dt.buffer,
      dt.byteOffset + options.byteOffset,
      value.length
    );

    TEXT_ENCODER.encodeInto(value, view);
    super.incrementOffset(options, value.length);
  }

  write(value: string, dt: DataView, options: Options = { byteOffset: 0 }): void {
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

  read(dt: DataView, options: Options = { byteOffset: 0 }): string {
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