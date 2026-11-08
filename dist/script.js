/* eslint-disable no-console */
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { isValidGuess } from "./core/validator.js";
import { compare, generateSecret, formatResult } from "./core/game.js";
async function main() {
    const rl = readline.createInterface({ input, output });
    try {
        console.log("=== Welcome to Bulls and Cows! ===");
        const length = 4;
        const base = 10;
        const secret = generateSecret(length, base);
        let attempts = 0;
        let isGuessed = false;
        console.log(`I have picked a ${length}-digit secret number (base ${base}). Try to guess it!`);
        while (!isGuessed) {
            const guess = (await rl.question("\nEnter your guess: ")).trim();
            if (!isValidGuess(guess, length, base)) {
                console.log(`Invalid guess! Please enter ${length} unique digits for base ${base}.`);
                continue;
            }
            attempts += 1;
            const result = compare(secret, guess);
            console.log(`Result: ${formatResult(result)}`);
            if (result.bulls === length) {
                isGuessed = true;
                console.log(`Congratulations! You found the secret "${secret}" in ${attempts} attempts! 🎉`);
            }
        }
    }
    finally {
        rl.close();
    }
}
main().catch((error) => {
    console.error("An unexpected error occurred:", error);
});
