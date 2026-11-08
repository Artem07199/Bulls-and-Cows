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

const countPermutations = (length: number, base: number): number => {
  if (length === 0) {
    return 1;
  }
  if (length > base || length < 0 || base <= 0) {
    return 0;
  }
  return base * countPermutations(length - 1, base - 1);
};

const memoize2 = <T, U, R>(fn: (a: T, b: U) => R): ((a: T, b: U) => R) => {
  const cache = new Map<string, R>();
  return (a: T, b: U): R => {
    const key = `${String(a)}:${String(b)}`;
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }
    const computed = fn(a, b);
    cache.set(key, computed);
    return computed;
  };
};

const normalizeBase = (base: NumericBase): number => {
  if (typeof base === "number") {
    return base;
  }
  const map: Record<string, number> = { bin: 2, oct: 8, dec: 10, hex: 16 };
  return map[base] ?? 10;
};

export const countPossibleSecrets = memoize2((length: number, base: NumericBase): number => {
  return countPermutations(length, normalizeBase(base));
});
