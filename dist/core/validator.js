const BINARY_CHARS = ["0", "1"];
const OCTAL_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7"];
const DECIMAL_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
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
];
const BASE_CHAR_SETS = {
    2: BINARY_CHARS,
    8: OCTAL_CHARS,
    10: DECIMAL_CHARS,
    16: HEX_CHARS,
    bin: BINARY_CHARS,
    oct: OCTAL_CHARS,
    dec: DECIMAL_CHARS,
    hex: HEX_CHARS,
};
export const createDigitValidator = (base) => (char) => {
    if (char.length !== 1) {
        return false;
    }
    const lower = char.toLowerCase();
    const allowed = BASE_CHAR_SETS[base];
    return allowed ? allowed.includes(lower) : false;
};
export const isValidGuess = (guess, length, base) => {
    if (guess.length !== length) {
        return false;
    }
    const isDigitValid = createDigitValidator(base);
    const normalizedChars = guess.toLowerCase().split("");
    const allDigitsValid = normalizedChars.every(isDigitValid);
    if (!allDigitsValid) {
        return false;
    }
    const uniqueChars = new Set(normalizedChars);
    return uniqueChars.size === length;
};
