import { describe, expect, it } from 'vitest';
import { countPossibleSecrets, evaluateGuess, generateSecret} from '../src/core/game.js';


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


describe('generateSecret', () => {
  it('generates a string with the exact requested length', () => {
    const secret = generateSecret(4, 10);
    expect(typeof secret).toBe('string');
    expect(secret).toHaveLength(4);
  });

  it('contains only unique digits', () => {
    const secret = generateSecret(6, 16);
    const unique = new Set(secret.split(''));
    expect(unique.size).toBe(6);
  });

  it('uses only allowed digits for the given base', () => {
    const binSecret = generateSecret(2, 2);
    expect(['01', '10']).toContain(binSecret);

    const octSecret = generateSecret(4, 8);
    const validOctal = /^[0-7]+$/;
    expect(validOctal.test(octSecret)).toBe(true);
  });

  it('produces deterministic output when a custom random function is injected', () => {
    const fixedZeroRng = () => 0;
    const secret = generateSecret(4, 10, fixedZeroRng);
    expect(secret).toBe('0123');
  });

  it('can start with leading zero', () => {
    const pickFirstRng = () => 0;
    const secret = generateSecret(3, 8, pickFirstRng);
    expect(secret.startsWith('0')).toBe(true);
  });
});
describe('countPossibleSecrets', () => {
  it('correctly calculates permutations for binary base (2)', () => {
    expect(countPossibleSecrets(2, 2)).toBe(2);
  });

  it('correctly calculates permutations for decimal base (10)', () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040);
    expect(countPossibleSecrets(1, 10)).toBe(10);
  });

  it('correctly calculates permutations for hexadecimal base (16)', () => {
    expect(countPossibleSecrets(2, 16)).toBe(240);
  });

  it('returns 1 when length is 0 (empty permutation)', () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
  });

  it('returns 0 when length exceeds base', () => {
    expect(countPossibleSecrets(3, 2)).toBe(0);
  });
});