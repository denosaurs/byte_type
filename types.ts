export type InnerType<T> = T extends Type<infer I> ? I : never;

export interface Type<T> {
  read(view: DataView, byteOffset: number): T;
  write(view: DataView, byteOffset: number, value: T): void;
}

export interface SizedType<T> extends Type<T> {
  byteLength: number;
}

export interface AlignedType<T> extends SizedType<T> {
  byteAlign: number;
}
