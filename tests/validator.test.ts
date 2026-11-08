import { describe, expect, it } from "vitest";
import { createDigitValidator, isValidGuess } from "../src/core/validator.js";

describe("createDigitValidator", () => {
  it("correctly validates binary digits (base 2)", () => {
    const isBin = createDigitValidator(2);
    expect(isBin("0")).toBe(true);
    expect(isBin("1")).toBe(true);
    expect(isBin("2")).toBe(false);
    expect(isBin("a")).toBe(false);
  });

  it("correctly validates octal digits (base 8)", () => {
    const isOct = createDigitValidator(8);
    expect(isOct("7")).toBe(true);
    expect(isOct("8")).toBe(false);
  });

  it("correctly validates decimal digits (base 10)", () => {
    const isDec = createDigitValidator(10);
    expect(isDec("9")).toBe(true);
    expect(isDec("a")).toBe(false);
  });

  it("correctly validates hex digits case-insensitively (base 16)", () => {
    const isHex = createDigitValidator(16);
    expect(isHex("a")).toBe(true);
    expect(isHex("F")).toBe(true);
    expect(isHex("g")).toBe(false);
  });

  it("returns false for multi-character strings or empty strings", () => {
    const isDec = createDigitValidator(10);
    expect(isDec("")).toBe(false);
    expect(isDec("10")).toBe(false);
  });
});

describe("isValidGuess", () => {
  it("returns true for a valid decimal guess of exact length with unique digits", () => {
    expect(isValidGuess("1234", 4, 10)).toBe(true);
  });

  it("returns false when length does not match expected length", () => {
    expect(isValidGuess("123", 4, 10)).toBe(false);
    expect(isValidGuess("12345", 4, 10)).toBe(false);
  });

  it("returns false when digits repeat", () => {
    expect(isValidGuess("1123", 4, 10)).toBe(false);
    expect(isValidGuess("0120", 4, 10)).toBe(false);
  });

  it("returns false when characters are outside the allowed numeral base", () => {
    expect(isValidGuess("1289", 4, 8)).toBe(false);
    expect(isValidGuess("0102", 2, 2)).toBe(false);
  });

  it("accepts uppercase and lowercase hex characters without duplicate collision", () => {
    expect(isValidGuess("1aBc", 4, 16)).toBe(true);
    expect(isValidGuess("1aA2", 4, 16)).toBe(false);
  });
});