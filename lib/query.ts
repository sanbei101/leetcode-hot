import { toDifficultyKey, type Difficulty } from "@/lib/types";

export type SearchParams = Record<string, string | string[] | undefined>;

export const PAGE_SIZE = 20;

export interface QuestionFilters {
  readonly keyword: string | null;
  readonly difficulty: Difficulty | null;
  readonly company: string | null;
  readonly page: number;
}

export function parseQuestionFilters(params: SearchParams): QuestionFilters {
  return {
    keyword: readParam(params, "q")?.trim() || null,
    difficulty: toDifficultyKey(readParam(params, "difficulty")),
    company: readParam(params, "company")?.trim() || null,
    page: parsePage(readParam(params, "page")),
  };
}

export function questionHref(filters: QuestionFilters): string {
  const params = new URLSearchParams();
  if (filters.keyword !== null) params.set("q", filters.keyword);
  if (filters.difficulty !== null) params.set("difficulty", filters.difficulty);
  if (filters.company !== null) params.set("company", filters.company);
  if (filters.page > 1) params.set("page", String(filters.page));
  const query = params.toString();
  return query === "" ? "/" : `/?${query}`;
}

export type PaginationItem = number | "ellipsis";

export function paginationRange(current: number, total: number): readonly PaginationItem[] {
  if (total <= 7) return range(1, total);
  const candidates = new Set(
    [1, total, current - 1, current, current + 1].filter((page) => page >= 1 && page <= total),
  );
  const items: PaginationItem[] = [];
  let previous = 0;
  for (const page of [...candidates].sort((a, b) => a - b)) {
    if (page - previous > 1) items.push("ellipsis");
    items.push(page);
    previous = page;
  }
  return items;
}

function range(start: number, end: number): readonly PaginationItem[] {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
}

function readParam(params: SearchParams, key: string): string | null {
  const value = params[key];
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function parsePage(value: string | null): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
}
