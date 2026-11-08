import { GuessResult, NumericBase } from "./types.js";

export const evaluateGuess = (secret: string, guess: string): GuessResult => {
  const sChars = secret.toLowerCase().split("");
  const gChars = guess.toLowerCase().split("");

  const bulls = gChars.reduce(
    (count, char, index) => (char === sChars[index] ? count + 1 : count),
    0
  );

  const cows = gChars.reduce((count, char, index) => {
    const isPresent = sChars.includes(char);
    const isBull = char === sChars[index];
    return isPresent && !isBull ? count + 1 : count;
  }, 0);

  return { bulls, cows };
};

const BASE_DIGITS: Record<string | number, readonly string[]> = {
  2: ["0", "1"],
  8: ["0", "1", "2", "3", "4", "5", "6", "7"],
  10: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  16: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"],
  bin: ["0", "1"],
  oct: ["0", "1", "2", "3", "4", "5", "6", "7"],
  dec: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  hex: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"],
};

export const generateSecret = (
  length: number,
  base: NumericBase,
  random: () => number = Math.random
): string => {
  const pool = BASE_DIGITS[base] ?? BASE_DIGITS[10];

  const pickRecursively = (
    remainingPool: readonly string[],
    needed: number,
    accumulated: readonly string[]
  ): readonly string[] => {
    if (needed === 0 || remainingPool.length === 0) {
      return accumulated;
    }
    const index = Math.floor(random() * remainingPool.length);
    const chosen = remainingPool[index];
    const nextPool = remainingPool.filter((_, i) => i !== index);
    return pickRecursively(nextPool, needed - 1, [...accumulated, chosen]);
  };

  return pickRecursively(pool, length, []).join("");
};

export const countPossibleSecrets = (
  _length: number,
  _base: NumericBase
): number => {
  return -1;
};