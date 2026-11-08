export type RadixBase = 2 | 8 | 10 | 16;
export type BaseName = "bin" | "oct" | "dec" | "hex";
export type NumericBase = 2 | 8 | 10 | 16;

export interface GuessResult {
  readonly bulls: number;
  readonly cows: number;
}

export interface HistoryEntry {
  readonly guess: string;
  readonly result: GuessResult;
}

export interface ScoreRecord {
  readonly length: number;
  readonly base: NumericBase;
  readonly attempts: number;
  readonly timeSeconds: number;
  readonly date: string;
}

export interface GameState {
  readonly secret: string;
  readonly length: number;
  readonly base: NumericBase;
  readonly isRunning: boolean;
  readonly isWon: boolean;
  readonly startTime: number;
  readonly history: readonly HistoryEntry[];
}
