export type InnerType<T> = T extends Type<infer I> ? I : never;

export interface Type<T> {
  read(view: DataView, offset: number): T;
  write(view: DataView, offset: number, value: T): void;
}

export interface SizedType<T> extends Type<T> {
  byteLength: number;
}

export interface AlignedType<T> extends SizedType<T> {
  byteAlign: number;
}

export interface Viewable<V> {
  view(view: DataView, offset: number): V;
}

export interface Proxied<P> {
  proxy(view: DataView, offset: number): P;
}
