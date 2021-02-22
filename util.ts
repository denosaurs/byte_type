export function order<
  V extends Record<string, unknown>,
  T extends Record<string, unknown> = { [K in keyof V]: unknown },
>(object: V, order: T): T {
  const reordered: Record<string, unknown> = {};

  for (const key of Object.keys(order)) {
    reordered[key] = object[key];
  }

  return reordered as T;
}
