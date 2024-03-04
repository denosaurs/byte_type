import { align } from "../util.ts";
import type { Options } from "./common.ts";

export interface Unsized<T> {
  readonly byteAlignment: number;

  readPacked(dt: DataView, options?: Options): T;
  writePacked(value: T, dt: DataView, options?: Options): void;
}

/**
 * `UnsizedType<T>` is one of the two base classes for implementing a codec.
 * 
 * This is the most common used class for when you do not know the size of your struct.
 */
export abstract class UnsizedType<T> implements Unsized<T> {
  constructor(readonly byteAlignment: number) {}

  /**
   * Read a value from the provided buffer while consuming as little bytes as possible.
   * This method is used for data over the network or when reading memory that may not be aligned
   * 
   * ### Implementors be aware!
   * - This method is the base functionality of `Unsized<T>.read()` if that method is not overridden.
   * - This method does not automatically offset or align the `Options.byteOffset`. You need to do this yourself.
   */
  abstract readPacked(dt: DataView, options?: Options): T;

  /**
   * write a value into the provided buffer while consuming as little bytes as possible.
   * This method is used for data over the network or when writing memory that may not be aligned
   * 
   * ### Implementors be aware!
   * - This method is the base functionality of `Unsized<T>.write()` if it's not implemented
   * - This method does not automatically offset or align the `Options.byteOffset`. You need to do this yourself
   */
  abstract writePacked(value: T, dt: DataView, options?: Options): void;

  /**
   * Read a aligned value from the provided buffer and optional byte offset
   * 
   * ### Implementors be aware
   * - This is a function that is automatically implemented but may not be correct all the time.
   * - This function only works in a vacuum. This means that it will only work on single types.
   * - Composable types may not give the correct result and need to be written from scratch.
   */
  read(dt: DataView, options: Options = { byteOffset: 0 }): T {
    this.alignOffset(options);
    return this.readPacked(dt, options);
  }

  /**
   * Write a value into the provided buffer at a optional offset that is automatically aligned
   *
   * ### Implementors be aware
   * - This is a function that is automatically implemented but may not be correct all the time.
   * - This function only works in a vacuum. This means that it will only work on single types.
   * - Composable types may not give the correct result and need to be written from scratch.
   */
  write(value: T, dt: DataView, options: Options = { byteOffset: 0 }): void {
    this.alignOffset(options);
    this.writePacked(value, dt, options);
  }

  /** Align the offset of `Options.byteOffset` to the nearest integer divisable by `UnsizedType<T>.byteAlignment` */
  protected alignOffset(options: Options) {
    options.byteOffset = align(options.byteOffset, this.byteAlignment);
  }

  /** Increment offset by the provided `byteSize` */
  protected incrementOffset(options: Options, byteSize: number) {
    options.byteOffset += byteSize;
  }
}
