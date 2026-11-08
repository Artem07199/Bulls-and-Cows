import { createDigitValidator, isValidGuess } from "../core/validator.js";
import { generateSecret, evaluateGuess, countPossibleSecrets } from "../core/game.js";
import { el } from "./dom.js";
import { loadHighScores, saveHighScore } from "./storage.js";
const root = el("main", { className: "app-container" });
document.body.appendChild(root);
let state = {
    secret: "",
    length: 4,
    base: 10,
    isRunning: false,
    isWon: false,
    startTime: 0,
    history: [],
};
const render = () => {
    root.replaceChildren();
    const header = el("header", {}, [el("h1", { textContent: "Bulls and Cows" })]);
    const baseSelect = el("select", { disabled: state.isRunning });
    const bases = [2, 8, 10, 16];
    bases.forEach((b) => {
        const opt = el("option", {
            textContent: b === 2
                ? "Binary (2)"
                : b === 8
                    ? "Octal (8)"
                    : b === 10
                        ? "Decimal (10)"
                        : "Hexadecimal (16)",
            value: String(b),
        });
        if (b === state.base)
            opt.selected = true;
        baseSelect.appendChild(opt);
    });
    const lengthSelect = el("select", { disabled: state.isRunning });
    const lengths = state.base === 2 ? [2] : [2, 3, 4, 5, 6];
    lengths.forEach((len) => {
        const opt = el("option", {
            textContent: `${len} digits`,
            value: String(len),
        });
        if (len === state.length)
            opt.selected = true;
        lengthSelect.appendChild(opt);
    });
    const possiblePermutations = countPossibleSecrets(state.length, state.base);
    const possibleBadge = el("small", {
        className: "badge",
        textContent: `Possible combinations: ${possiblePermutations.toLocaleString()}`,
    });
    baseSelect.addEventListener("change", () => {
        const newBase = Number(baseSelect.value);
        const newLength = newBase === 2 ? 2 : state.length > 2 ? state.length : 2;
        state = { ...state, base: newBase, length: newLength };
        render();
    });
    lengthSelect.addEventListener("change", () => {
        const newLength = Number(lengthSelect.value);
        state = { ...state, length: newLength };
        render();
    });
    const startButton = el("button", {
        textContent: state.isRunning ? "Game in Progress..." : "Start Game",
        disabled: state.isRunning,
    });
    startButton.addEventListener("click", () => {
        const secret = generateSecret(state.length, state.base);
        state = {
            ...state,
            secret,
            isRunning: true,
            isWon: false,
            startTime: Date.now(),
            history: [],
        };
        render();
    });
    const settingsPanel = el("section", { className: "panel" }, [
        el("h2", { textContent: "Settings" }),
        el("div", { className: "form-group" }, [
            el("label", { textContent: "Base (Numeral System)" }),
            baseSelect,
        ]),
        el("div", { className: "form-group" }, [
            el("label", { textContent: "Secret Length" }),
            lengthSelect,
            possibleBadge,
        ]),
        startButton,
    ]);
    root.appendChild(header);
    root.appendChild(settingsPanel);
    if (state.isRunning) {
        const errorMsg = el("p", { className: "error-text" });
        const guessInput = el("input", {
            type: "text",
            placeholder: `Enter ${state.length} unique characters...`,
            disabled: state.isWon,
        });
        const validator = createDigitValidator(state.base);
        guessInput.addEventListener("beforeinput", (e) => {
            if (e.data) {
                const chars = e.data.split("");
                const hasInvalid = chars.some((c) => !validator(c));
                if (hasInvalid) {
                    e.preventDefault();
                }
            }
        });
        const submitGuess = () => {
            const rawGuess = guessInput.value.trim().toLowerCase();
            errorMsg.textContent = "";
            if (!isValidGuess(rawGuess, state.length, state.base)) {
                errorMsg.textContent = `Invalid guess! Must be ${state.length} unique characters for base ${state.base}.`;
                return;
            }
            const alreadyGuessed = state.history.some((h) => h.guess.toLowerCase() === rawGuess);
            if (alreadyGuessed) {
                errorMsg.textContent = "You already tried this guess!";
                return;
            }
            const result = evaluateGuess(state.secret, rawGuess);
            const newHistoryEntry = { guess: rawGuess, result };
            const updatedHistory = [...state.history, newHistoryEntry];
            const isWon = result.bulls === state.length;
            if (isWon) {
                const timeSeconds = Math.max(1, Math.round((Date.now() - state.startTime) / 1000));
                const record = {
                    length: state.length,
                    base: state.base,
                    attempts: updatedHistory.length,
                    timeSeconds,
                    date: new Date().toLocaleDateString(),
                };
                saveHighScore(record);
                state = {
                    ...state,
                    history: updatedHistory,
                    isWon: true,
                };
            }
            else {
                state = {
                    ...state,
                    history: updatedHistory,
                };
            }
            render();
        };
        const submitBtn = el("button", {
            textContent: "Check Guess",
            disabled: state.isWon,
        });
        submitBtn.addEventListener("click", submitGuess);
        guessInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter")
                submitGuess();
        });
        const historyItems = state.history.map((entry, idx) => el("li", { className: "history-item" }, [
            el("span", { textContent: `#${idx + 1}: ${entry.guess.toUpperCase()}` }),
            el("span", {
                textContent: `${entry.result.bulls} bull${entry.result.bulls === 1 ? "" : "s"}, ${entry.result.cows} cow${entry.result.cows === 1 ? "" : "s"}`,
            }),
        ]));
        const historySection = el("ul", { className: "history-list" }, historyItems);
        const gamePanelChildren = [
            el("h2", { textContent: "Active Game" }),
            el("div", { className: "form-group" }, [guessInput, errorMsg, submitBtn]),
            el("h3", { textContent: "Attempts History" }),
            historySection,
        ];
        if (state.isWon) {
            const elapsed = Math.round((Date.now() - state.startTime) / 1000);
            const winBanner = el("div", { className: "win-banner" }, [
                el("h3", { textContent: "Congratulations! You Won!" }),
                el("p", {
                    textContent: `Secret was ${state.secret.toUpperCase()}. Found in ${state.history.length} attempts and ${elapsed}s!`,
                }),
            ]);
            const newGameBtn = el("button", { textContent: "New Game" });
            newGameBtn.addEventListener("click", () => {
                state = {
                    ...state,
                    isRunning: false,
                    isWon: false,
                    history: [],
                    secret: "",
                };
                render();
            });
            gamePanelChildren.unshift(winBanner, newGameBtn);
        }
        const gamePanel = el("section", { className: "panel" }, gamePanelChildren);
        root.appendChild(gamePanel);
    }
    const scores = loadHighScores();
    const rows = scores.map((s, idx) => el("tr", {}, [
        el("td", { textContent: `#${idx + 1}` }),
        el("td", { textContent: `Base ${s.base}, Len ${s.length}` }),
        el("td", { textContent: String(s.attempts) }),
        el("td", { textContent: `${s.timeSeconds}s` }),
        el("td", { textContent: s.date }),
    ]));
    const table = el("table", {}, [
        el("thead", {}, [
            el("tr", {}, [
                el("th", { textContent: "Rank" }),
                el("th", { textContent: "Mode" }),
                el("th", { textContent: "Attempts" }),
                el("th", { textContent: "Time" }),
                el("th", { textContent: "Date" }),
            ]),
        ]),
        el("tbody", {}, rows),
    ]);
    const scoresPanel = el("section", { className: "panel" }, [
        el("h2", { textContent: "High Scores" }),
        scores.length === 0
            ? el("p", { textContent: "No records yet. Win a round to get on the board!" })
            : table,
    ]);
    root.appendChild(scoresPanel);
};
render();
