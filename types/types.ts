export interface TypeOptions {
  byteOffset?: number;
}

export type InnerType<T> = T extends Type<infer I> ? I : never;
export interface Type<T> {
  read(dataView: DataView, byteOffset?: TypeOptions): T;
  write(value: T, dataView: DataView, byteOffset?: TypeOptions): void;
}

export interface SizedType<T> extends Type<T> {
  byteLength: number;
}

export interface AlignedType<T> extends SizedType<T> {
  byteAlign: number;
}

export interface ViewableType<T> {
  view(dataView: DataView, byteOffset?: TypeOptions): T;
}
