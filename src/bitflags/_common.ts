export type OutputRecord<T extends Record<string, unknown>> = {
  [K in keyof T]: boolean;
};
