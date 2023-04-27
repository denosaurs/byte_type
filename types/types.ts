export interface TypeOptions {
  byteOffset?: number;
}

export type ReadOptions = TypeOptions;
export type WriteOptions = TypeOptions;
export type ViewOptions = TypeOptions;

export type InnerType<T> = T extends Type<infer I> ? I : never;

export interface Type<T> {
  read(dataView: DataView, options?: ReadOptions): T;
  write(value: T, dataView: DataView, options?: WriteOptions): void;
}

export interface SizedType<T> extends Type<T> {
  byteLength: number;
}

export interface AlignedType<T> extends SizedType<T> {
  byteAlign: number;
}

export interface ViewableType<T> {
  view(dataView: DataView, options?: ViewOptions): T;
}
