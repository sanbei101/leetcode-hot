export type Difficulty = "easy" | "medium" | "hard";

export type DifficultyLabel = "简单" | "中等" | "困难";

export const DIFFICULTY_LABELS: Readonly<Record<Difficulty, DifficultyLabel>> = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
};

export function toDifficulty(label: string): Difficulty | null {
  switch (label) {
    case "简单":
      return "easy";
    case "中等":
      return "medium";
    case "困难":
      return "hard";
    default:
      return null;
  }
}

export function toDifficultyKey(value: string | null): Difficulty | null {
  switch (value) {
    case "easy":
      return "easy";
    case "medium":
      return "medium";
    case "hard":
      return "hard";
    default:
      return null;
  }
}

export interface HottestQuestion {
  readonly title: string;
  readonly freq: number;
}

export interface Overview {
  readonly totalQuestions: number;
  readonly byDifficulty: Readonly<Record<Difficulty, number>>;
  readonly companyCount: number;
  readonly hottest: HottestQuestion | null;
  readonly lastSeen: string | null;
}

export interface CompanyFrequency {
  readonly company: string;
  readonly questionCount: number;
}

export interface QuestionQuery {
  readonly keyword: string | null;
  readonly difficulty: Difficulty | null;
  readonly company: string | null;
  readonly page: number;
  readonly pageSize: number;
}

export interface QuestionSummary {
  readonly questionNo: string;
  readonly title: string;
  readonly difficulty: Difficulty;
  readonly freq: number;
  readonly companyCount: number;
  readonly lastSeen: string | null;
  readonly url: string | null;
}

export interface QuestionPage {
  readonly items: readonly QuestionSummary[];
  readonly total: number;
  readonly totalPages: number;
}
