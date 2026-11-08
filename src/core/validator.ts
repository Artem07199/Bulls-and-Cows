import { NumericBase } from "./types.js";

const BINARY_CHARS = ["0", "1"] as const;
const OCTAL_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7"] as const;
const DECIMAL_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
const HEX_CHARS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
] as const;

const BASE_CHAR_SETS: Record<string | number, readonly string[]> = {
  2: BINARY_CHARS,
  8: OCTAL_CHARS,
  10: DECIMAL_CHARS,
  16: HEX_CHARS,
  bin: BINARY_CHARS,
  oct: OCTAL_CHARS,
  dec: DECIMAL_CHARS,
  hex: HEX_CHARS,
};

export const createDigitValidator =
  (base: NumericBase) =>
  (char: string): boolean => {
    if (char.length !== 1) {
      return false;
    }
    const lower = char.toLowerCase();
    const allowed = BASE_CHAR_SETS[base];
    return allowed ? allowed.includes(lower) : false;
  };
