import { Options } from "./_common.ts";
import { Unsized } from "./unsized.ts";

export interface Packed<T> extends Unsized<T> {
  readPacked(dt: DataView, options?: Options): T;
  writePacked(value: T, dt: DataView, options?: Options): void;
}
