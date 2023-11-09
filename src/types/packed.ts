import type { Options } from "./_common.ts";
import type { Unsized } from "./unsized.ts";

export interface Packed<T> extends Unsized<T> {
  readPacked(dt: DataView, options?: Options): T;
  writePacked(value: T, dt: DataView, options?: Options): void;
}
