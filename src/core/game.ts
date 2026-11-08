import { GuessResult } from './types.js';

export const evaluateGuess = (
  _secret: string,
  _guess: string
): GuessResult => {
  return { bulls: -1, cows: -1 };
};