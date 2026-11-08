export type RadixBase = 2 | 8 | 10 | 16;
export type BaseName = "bin" | "oct" | "dec" | "hex";
export type NumericBase = 2 | 8 | 10 | 16;
export interface GuessResult {
  readonly bulls: number;
  readonly cows: number;
}
