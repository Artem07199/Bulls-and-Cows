import { describe, expect, it } from 'vitest';
import { createDigitValidator } from '../src/core/validator.js';

describe('createDigitValidator', () => {
  it('correctly validates binary digits (base 2)', () => {
    const isBin = createDigitValidator(2);
    expect(isBin('0')).toBe(true);
    expect(isBin('1')).toBe(true);
    expect(isBin('2')).toBe(false);
    expect(isBin('a')).toBe(false);
  });

  it('correctly validates octal digits (base 8)', () => {
    const isOct = createDigitValidator(8);
    expect(isOct('7')).toBe(true);
    expect(isOct('8')).toBe(false);
  });

  it('correctly validates decimal digits (base 10)', () => {
    const isDec = createDigitValidator(10);
    expect(isDec('9')).toBe(true);
    expect(isDec('a')).toBe(false);
  });

  it('correctly validates hex digits case-insensitively (base 16)', () => {
    const isHex = createDigitValidator(16);
    expect(isHex('a')).toBe(true);
    expect(isHex('F')).toBe(true);
    expect(isHex('g')).toBe(false);
  });

  it('returns false for multi-character strings or empty strings', () => {
    const isDec = createDigitValidator(10);
    expect(isDec('')).toBe(false);
    expect(isDec('10')).toBe(false);
  });
});