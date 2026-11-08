# Architectural Design, Clean Code & Complexity Analysis

## 1. Data Structures and Algorithms by Function (+8 points)

### `createDigitValidator(base)`

- **Data Structure**: `Set<string>`.
- **Algorithm**: Factory function (higher-order function/closure). Upon invocation with a numeral radix $B \in \{2, 8, 10, 16\}$, it builds an immutable `Set` of allowed alphanumeric characters (`'0'`–`'9'`, `'a'`–`'f'`). The returned predicate closure tests character membership in $O(1)$ time without re-allocating lookup structures on subsequent calls.

### `isValidGuess(guess, length, base)`

- **Data Structure**: `Set<string>` and primitive string values.
- **Algorithm**: Predicate composition.
  1. Checks length equality: `guess.length === length`.
  2. Character legality: iterates over characters using `.every()` against the compiled validator from `createDigitValidator(base)`.
  3. Uniqueness verification: converts characters into a `Set` and verifies `new Set(guess.toLowerCase()).size === length` to eliminate duplicates without nested loops.

### `evaluateGuess(secret, guess)`

- **Data Structure**: JavaScript Arrays (`string[]`).
- **Algorithm**: Declarative two-pass reduction using pure array methods (`reduce`, `filter`, `includes`).
  1. Calculates **Bulls**: matches where `guess[i] === secret[i]`.
  2. Calculates **Cows**: filters out bull indices, then counts occurrences where remaining guess characters exist inside remaining secret characters. Avoids side-effects and mutable counters.

### `generateSecret(length, base, random = Math.random)`

- **Data Structure**: Array of available symbols (`string[]`).
- **Algorithm**: Recursive sampling without replacement (Fisher-Yates style derivation). The function accepts a random generator via Dependency Injection (`random = Math.random`). At each recursive step, a pseudo-random index is selected, the character is appended to the accumulator, and that character is removed from the remaining pool until the target length is met.

### `countPossibleSecrets(length, base)`

- **Data Structure**: Hash Map / Object cache (`Record<string, number>`) for memoization.
- **Algorithm**: Recursive permutation calculation $P(B, L) = \frac{B!}{(B - L)!}$ based on the recurrence relation:
  $$\text{count}(l, b) = b \times \text{count}(l - 1, b - 1)$$
  with base case $\text{count}(0, b) = 1$. The recursive function is wrapped in a generic higher-order memoization decorator to cache intermediate factorials by key `${length}:${base}`.

---

## 2. Big O Complexity Analysis (+8 points)

Notation:

- $L$ — length of the secret/guess ($2 \le L \le 6$)
- $B$ — numeral base/radix ($2 \le B \le 16$)

### 1. `createDigitValidator(base)`

- **Time Complexity**:
  - Construction: $O(B)$ — iterates up to $B$ elements to populate the internal `Set`.
  - Returned predicate execution: $O(1)$ — `Set.prototype.has` provides constant time hash lookup.
- **Space Complexity**: $O(B)$ — stores $B$ characters in the closure `Set`.
- **Justification**: The lookup set is initialized once and retained in memory via closure; validating any character takes constant time regardless of input size.

### 2. `isValidGuess(guess, length, base)`

- **Time Complexity**: $O(L)$
- **Space Complexity**: $O(L)$
- **Justification**:
  - Checking length takes $O(1)$.
  - Checking valid characters involves traversing $L$ elements via `.every()` with an $O(1)$ lookup per character: $O(L)$.
  - Creating `new Set(guess)` traverses $L$ characters: $O(L)$ time and $O(L)$ auxiliary space.
  - Total time is linear with respect to guess length: $O(L) + O(L) = O(L)$.

### 3. `evaluateGuess(secret, guess)`

- **Time Complexity**: $O(L^2)$ worst case / $O(L)$ typical
- **Space Complexity**: $O(L)$
- **Justification**:
  - Transforming strings into arrays takes $O(L)$ time and space.
  - Counting Bulls traverses array of length $L$: $O(L)$.
  - Counting Cows filters non-bull characters (up to $L$) and performs `.includes()` across the remaining secret array (size $\le L$), taking at most $O(L \times L) = O(L^2)$. Since $L \le 6$, this is effectively instantaneous.

### 4. `countPossibleSecrets(length, base)`

- **Time Complexity**:
  - **Uncached (first call)**: $O(L)$ — performs exactly $L$ recursive steps decrementing length until $0$.
  - **Cached (memoized)**: $O(1)$ — instantaneous key lookup in the memoization table.
- **Space Complexity**:
  - Call stack: $O(L)$ recursive frames.
  - Memo cache: $O(U)$ where $U$ is the number of unique `(length, base)` query pairs ($U \le 24$).
- **Justification**: Each recursive step computes a single multiplication. Once evaluated, subsequent requests with identical arguments return in constant time $O(1)$ from the hash map.

---

## 3. Clean Code Principles Applied (+4 points)

### 1. Single Responsibility Principle (SRP)

- **Where applied**: `src/core/validators.ts`, `src/core/evaluator.ts`, `src/core/generator.ts`.
- Each module does exactly one job: `validators.ts` only validates characters and guesses, `evaluator.ts` only scores bulls and cows, `storage.ts` only abstracts `localStorage`.

### 2. Immutability & Pure Functions (Functional Programming)

- **Where applied**: All functions in `src/core/`.
- No global state mutation or parameter mutation. Arrays are transformed via pure declarative methods (`filter`, `reduce`, `map`), and input strings/tuples are treated as strictly `readonly`.

### 3. Dependency Injection (Testability & Inversion of Control)

- **Where applied**: `generateSecret(length, base, random = Math.random)` in `src/core/generator.ts`.
- The pseudo-random generator is passed as an optional dependency. This allows unit tests in `tests/game.test.ts` to inject deterministic PRNG functions without monkey-patching `Math.random`.

### 4. Self-Documenting Code & Explicit Typing

- **Where applied**: `src/core/types.ts` and throughout the codebase.
- Function names clearly reflect their intent (`isValidGuess`, `countPossibleSecrets`). All parameters and return values are strictly typed using TypeScript interfaces (`ScoreRecord`, `EvaluationResult`) with zero `any` usage.

### 5. Defensive Programming & Graceful Degradation

- **Where applied**: `src/ui/storage.ts` and `src/ui/dom.ts`.
- `localStorage` interactions are wrapped inside `try/catch` to avoid crashes in private browsing mode or when storage quota is exceeded.
