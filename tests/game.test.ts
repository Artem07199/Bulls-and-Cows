import { describe, expect, it } from 'vitest';
import { evaluateGuess } from '../src/core/game.js';

describe('evaluateGuess', () => {
  it('returns 0 bulls and 0 cows for completely disjoint inputs', () => {
    const result = evaluateGuess('1234', '5678');
    expect(result).toEqual({ bulls: 0, cows: 0 });
  });

  it('correctly calculates exact matches (bulls)', () => {
    const result = evaluateGuess('1234', '1298');
    expect(result).toEqual({ bulls: 2, cows: 0 });
  });

  it('correctly calculates misplaced matches (cows)', () => {
    const result = evaluateGuess('1234', '4321');
    expect(result).toEqual({ bulls: 0, cows: 4 });
  });

  it('correctly evaluates mixed bulls and cows', () => {
    const result = evaluateGuess('1234', '1325');
    // '1' на месте (1 bull), '3' и '2' не на своих местах (2 cows)
    expect(result).toEqual({ bulls: 1, cows: 2 });
  });

  it('handles case-insensitivity for hexadecimal digits', () => {
    const result = evaluateGuess('1a2f', '1A2F');
    expect(result).toEqual({ bulls: 4, cows: 0 });

    const mixedResult = evaluateGuess('1a2f', 'f2a1');
    expect(mixedResult).toEqual({ bulls: 0, cows: 4 });
  });
});