import { type Options, SizedType } from "../types/mod.ts";
import { isLittleEndian } from "../util.ts";

export class U128 extends SizedType<bigint> {
  constructor(
    readonly littleEndian: boolean = isLittleEndian,
    /**
     * Clang, GCC and rust 1.78 (with LLVM 18) say 16 byte alignment.
     *
     * Older rust versions (or rust with older LLVM versions) say 8 byte alignment.
     *
     * Due to compatiblity reason we allow 8 byte alignment with these older versions.
     *
     * But by default it uses the now correct 16 byte alignment.
     *
     * See [Rust's blogpost](https://blog.rust-lang.org/2024/03/30/i128-layout-update.html) for more details
     */
    alignment: 8 | 16 = 16,
  ) {
    super(16, alignment);
  }

  override readPacked(
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): bigint {
    const partOne = dt.getBigUint64(options.byteOffset, this.littleEndian);
    const partTwo = dt.getBigUint64(options.byteOffset + 8, this.littleEndian);
    super.incrementOffset(options);
    // deno-fmt-ignore
    return this.littleEndian
        ? (partTwo << 64n) | partOne
        : (partOne << 64n) | partTwo;
  }

  override writePacked(
    value: bigint,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    const hi = value >> 64n;
    dt.setBigUint64(
      options.byteOffset,
      this.littleEndian ? hi : value,
      this.littleEndian,
    );
    dt.setBigUint64(
      options.byteOffset + 8,
      this.littleEndian ? value : hi,
      this.littleEndian,
    );

    super.incrementOffset(options);
  }
}

export class I128 extends SizedType<bigint> {
  constructor(
    readonly littleEndian: boolean = isLittleEndian,
    /**
     * Clang, GCC and rust 1.78 (with LLVM 18) say 16 byte alignment.
     *
     * Older rust versions (or rust with older LLVM versions) say 8 byte alignment.
     *
     * Due to compatiblity reason we allow 8 byte alignment with these older versions.
     *
     * But by default it uses the now correct 16 byte alignment.
     *
     * See [Rust's blogpost](https://blog.rust-lang.org/2024/03/30/i128-layout-update.html) for more details
     */
    alignment: 8 | 16 = 16,
  ) {
    super(16, alignment);
  }

  override readPacked(
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): bigint {
    const partOne = dt.getBigInt64(options.byteOffset, this.littleEndian);
    const partTwo = dt.getBigInt64(options.byteOffset + 8, this.littleEndian);
    super.incrementOffset(options);
    // deno-fmt-ignore
    return this.littleEndian
        ? (partTwo << 64n) | partOne
        : (partOne << 64n) | partTwo;
  }

  override writePacked(
    value: bigint,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    const hi = value >> 64n;
    dt.setBigInt64(
      options.byteOffset,
      this.littleEndian ? hi : value,
      this.littleEndian,
    );
    dt.setBigInt64(
      options.byteOffset + 8,
      this.littleEndian ? value : hi,
      this.littleEndian,
    );

    super.incrementOffset(options);
  }
}

export const u128le: U128 = new U128(true);
export const u128be: U128 = new U128(false);
export const u128: U128 = new U128();

export const i128le: I128 = new I128(true);
export const i128be: I128 = new I128(false);
export const i128: I128 = new I128();
