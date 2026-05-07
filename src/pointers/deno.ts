import { u64 } from "../mod.ts";
import { type Options, SizedType } from "../types/mod.ts";

export class DenoPtr<T> extends SizedType<Deno.PointerValue<T>> {
  constructor() {
    super(8, 8);
  }

  readPacked(
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): Deno.PointerValue<T> {
    const ptrValue = u64.readPacked(dt, options);
    return Deno.UnsafePointer.create(ptrValue);
  }

  writePacked(
    value: Deno.PointerValue<T>,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    let ptrValue = Deno.UnsafePointer.value(value);
    u64.writePacked(ptrValue, dt, options);
  }
}

export class DenoRef<T> extends SizedType<T> {
  #inner: SizedType<T>;
  #innerDT: DataView;

  constructor(type: SizedType<T>) {
    super(8, 8);
    const innerAB = new ArrayBuffer(type.byteSize);
    this.#innerDT = new DataView(innerAB);
    this.#inner = type;
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): T {
    const ptr = denoPointer.readPacked(dt, options);
    if (!ptr) throw new Error("Cannot dereference null ptr");
    const ptrView = new Deno.UnsafePointerView(ptr);
    ptrView.copyInto(this.#innerDT.buffer as ArrayBuffer, 0);

    return this.#inner.readPacked(this.#innerDT);
  }

  writePacked(
    value: T,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    const writeDT = this.#innerDT;
    const writePtr = Deno.UnsafePointer.of(
      this.#innerDT.buffer as ArrayBuffer,
    );

    this.#inner.writePacked(value, writeDT);

    denoPointer.writePacked(writePtr, dt, options);

    // Buff is now transfered so we need to create a new one
    const innerAB = new ArrayBuffer(this.#inner.byteSize);
    this.#innerDT = new DataView(innerAB);
  }
}

export const denoPointer = new DenoPtr();
