import { GuessResult, NumericBase } from './types.js';


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


export const generateSecret = (
  _length: number,
  _base: NumericBase,
  _random: () => number = Math.random
): string => {
  return '';
};