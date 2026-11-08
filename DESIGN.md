# Architectural Design & Complexity Analysis

## 1. Architectural Overview: Functional Core, Imperative Shell

The application is structured following the **Functional Core / Imperative Shell** architectural boundary to maximize testability, predictability, and maintainability.

- **Functional Core (`src/core/`)**:
  - Composed exclusively of pure functions without side effects.
  - Adheres strictly to immutability (immutable data structures, `readonly` interfaces, absence of mutation).
  - Independent of browser runtime, DOM, network, or Web APIs. Fully covered by automated Vitest suites.
- **Imperative Shell (`src/ui/`)**:
  - Manages UI lifecycle, user input handling, and side effects (`localStorage`, DOM events).
  - Interacts with the DOM exclusively via secure DOM APIs (`document.createElement`, `replaceChildren`) without invoking `innerHTML` or `insertAdjacentHTML` to prevent XSS vulnerabilities.

---

## 2. Core Modules & Design Patterns

### `createDigitValidator(base)`

- **Pattern**: Higher-Order Function / Currying / Factory Pattern.
- **Description**: Pre-computes a lookup `Set` of allowed alphanumeric characters for a given numerical radix ($2, 8, 10, 16$) and returns a specialized predicate `(char: string) => boolean`.
- **Benefit**: Reuses compiled validator sets across keystroke verifications without redundant array allocation.

### `isValidGuess(guess, length, base)`

- **Pattern**: Deterministic Predicate Composition.
- **Description**: Verifies that a guess matches the exact length, uses only legal digits according to `createDigitValidator`, and contains no duplicate symbols (verified using an immutable `Set` transformation).

### `evaluateGuess(secret, guess)`

- **Pattern**: Declarative Array Reductions.
- **Description**: Computes exact matches (Bulls) and misplaced matches (Cows) purely through functional array primitives (`reduce`, `filter`, `includes`), avoiding manual mutable counter loops.

### `generateSecret(length, base, random = Math.random)`

- **Pattern**: Dependency Injection / Tail Recursion.
- **Description**: Accepts the pseudo-random generator as an explicit parameter (defaulting to `Math.random`). This allows test suites to inject deterministic pseudo-random functions to test corner cases (e.g., leading zeros, specific orderings) without monkey-patching globals.

### `countPossibleSecrets(length, base)`

- **Pattern**: Recursion with Memoization.
- **Description**: Calculates permutations without repetition $P(\text{base}, \text{length}) = \frac{\text{base}!}{(\text{base} - \text{length})!}$ using the recursive relation:
  $$\text{count}(l, b) = b \times \text{count}(l - 1, b - 1)$$
  Wrapped in a generic higher-order memoization decorator to cache intermediate factorials.

---

## 3. Algorithmic Complexity (Big O)

| Function               | Time Complexity | Space Complexity | Explanation                                                                                                        |
| :--------------------- | :-------------: | :--------------: | :----------------------------------------------------------------------------------------------------------------- |
| `createDigitValidator` |     $O(B)$      |      $O(B)$      | Set construction over base alphabet of size $B$ ($B \le 16$). Predicate execution is $O(1)$.                       |
| `isValidGuess`         |     $O(L)$      |      $O(L)$      | Single-pass checks over string of length $L$ for length check, character validation, and uniqueness via `Set`.     |
| `evaluateGuess`        |     $O(L)$      |      $O(L)$      | Array splitting into characters ($O(L)$) followed by linear reductions across length $L$.                          |
| `generateSecret`       | $O(L \cdot B)$  |      $O(B)$      | Recursive selection of $L$ unique items from an initial pool of size $B$, filtering out picked elements each step. |
| `countPossibleSecrets` | $O(L)$ / $O(1)$ | $O(L)$ / $O(1)$  | Uncached: $L$ recursive calls. Cached (Memoized): $O(1)$ lookup via Hash Map.                                      |

_Where $L$ is the secret length ($2 \le L \le 6$) and $B$ is the numeral base ($2 \le B \le 16$). Given the bounded domain, all operations run in effectively constant time ($< 1\text{ ms}$)._

---

## 4. UI Security and Persistence

- **XSS Defense**: No string interpolation into HTML sinks. Text content is set strictly through `Node.textContent`.
- **Input Interception**: Evaluates characters on `beforeinput` events, preventing invalid base characters from appearing in the input field.
- **Storage Resilience**: `localStorage` read/write operations are isolated inside `try/catch` blocks to guard against corrupted serialized JSON and quota exhaustion.
