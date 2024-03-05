import { Unsized } from "./unsized.ts";

export interface Options {
  byteOffset: number;
}

/** Extract the inner value of a codec */
export type InnerType<T> = T extends Unsized<infer I> ? I : never;
export type ValueOf<T> = T[keyof T];
