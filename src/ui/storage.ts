import { ScoreRecord } from "../core/types.js";

const STORAGE_KEY = "bulls_and_cows_high_scores";

export const loadHighScores = (): readonly ScoreRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ScoreRecord[]) : [];
  } catch {
    return [];
  }
};

export const saveHighScore = (record: ScoreRecord): readonly ScoreRecord[] => {
  const current = loadHighScores();
  const updated = [...current, record].sort((a, b) => {
    if (a.attempts !== b.attempts) {
      return a.attempts - b.attempts;
    }
    return a.timeSeconds - b.timeSeconds;
  });
  const top10 = updated.slice(0, 10);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(top10));
  } catch (error) {
    void error;
  }
  return top10;
};
