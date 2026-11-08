export type RadixBase = 2 | 8 | 10 | 16;
export type BaseName = "bin" | "oct" | "dec" | "hex";
export type NumericBase = RadixBase | BaseName;
export interface ComparisonResult {
  readonly bulls: number;
  readonly cows: number;
}
