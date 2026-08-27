import { env } from "cloudflare:workers";

import {
  DIFFICULTY_LABELS,
  toDifficulty,
  type CompanyFrequency,
  type Difficulty,
  type Overview,
  type QuestionPage,
  type QuestionQuery,
  type QuestionSummary,
} from "@/lib/types";

interface QuestionRow {
  readonly questionNo: string;
  readonly title: string;
  readonly difficulty: string;
  readonly globalFreq: number;
  readonly lastSeen: string | null;
  readonly url: string | null;
  readonly companyFreq: number | null;
}

interface CountRow {
  readonly questionNo: string;
  readonly companyCount: number;
}

async function withLogging<T>(label: string, run: () => Promise<T>): Promise<T> {
  const startedAt = Date.now();
  try {
    const result = await run();
    console.log(`[db] ${label} ok (${Date.now() - startedAt}ms)`);
    return result;
  } catch (error) {
    console.error(`[db] ${label} failed (${Date.now() - startedAt}ms)`, error);
    throw error;
  }
}

export function getOverview(): Promise<Overview> {
  return withLogging("getOverview", async () => {
    const database = env.leetcode_db;
    const [difficultyResult, companyRow, hotRow, updatedRow] = await Promise.all([
      database
        .prepare(
          "SELECT difficulty AS difficulty, COUNT(*) AS count FROM codetop_questions GROUP BY difficulty",
        )
        .all<{ readonly difficulty: string; readonly count: number }>(),
      database
        .prepare("SELECT COUNT(DISTINCT company) AS count FROM codetop_company_questions")
        .first<{ readonly count: number }>(),
      database
        .prepare(
          "SELECT title AS title, global_freq AS freq FROM codetop_questions ORDER BY global_freq DESC LIMIT 1",
        )
        .first<{ readonly title: string; readonly freq: number }>(),
      database
        .prepare("SELECT MAX(last_seen) AS lastSeen FROM codetop_questions")
        .first<{ readonly lastSeen: string | null }>(),
    ]);

    const byDifficulty: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 };
    for (const row of difficultyResult.results) {
      const difficulty = toDifficulty(row.difficulty);
      if (difficulty !== null) byDifficulty[difficulty] += row.count;
    }

    return {
      totalQuestions: byDifficulty.easy + byDifficulty.medium + byDifficulty.hard,
      byDifficulty,
      companyCount: companyRow?.count ?? 0,
      hottest: hotRow === null ? null : { title: hotRow.title, freq: hotRow.freq },
      lastSeen: updatedRow?.lastSeen ?? null,
    };
  });
}

export function listCompanies(): Promise<readonly CompanyFrequency[]> {
  return withLogging("listCompanies", async () => {
    const { results } = await env.leetcode_db
      .prepare(
        "SELECT company AS company, COUNT(*) AS questionCount FROM codetop_company_questions GROUP BY company ORDER BY questionCount DESC, company ASC",
      )
      .all<{ readonly company: string; readonly questionCount: number }>();
    return results;
  });
}

export function listQuestions(query: QuestionQuery): Promise<QuestionPage> {
  return withLogging("listQuestions", async () => {
    const database = env.leetcode_db;
    const conditions: string[] = [];
    const whereParams: (string | number)[] = [];

    if (query.keyword !== null) {
      const pattern = `%${escapeLike(query.keyword)}%`;
      conditions.push("(q.title LIKE ? ESCAPE '\\' OR q.question_no LIKE ? ESCAPE '\\')");
      whereParams.push(pattern, pattern);
    }
    if (query.difficulty !== null) {
      conditions.push("q.difficulty = ?");
      whereParams.push(DIFFICULTY_LABELS[query.difficulty]);
    }
    if (query.company !== null) {
      conditions.push("cq.company = ?");
      whereParams.push(query.company);
    }

    const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
    const joined = query.company !== null;
    const joinClause = joined
      ? "INNER JOIN codetop_company_questions cq ON cq.question_no = q.question_no AND cq.company = ?"
      : "";
    const orderClause = joined
      ? " ORDER BY COALESCE(cq.freq, 0) DESC, q.global_freq DESC, q.question_no ASC"
      : " ORDER BY q.global_freq DESC, q.question_no ASC";
    const companyFreqExpr = joined ? "cq.freq" : "NULL";
    const joinParams: (string | number)[] = joined ? [query.company] : [];

    const countRow = await database
      .prepare(`SELECT COUNT(*) AS total FROM codetop_questions q ${joinClause}${whereClause}`)
      .bind(...joinParams, ...whereParams)
      .first<{ readonly total: number }>();
    const total = countRow?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
    const page = Math.min(query.page, totalPages);
    const offset = (page - 1) * query.pageSize;

    const { results } = await database
      .prepare(
        `SELECT q.question_no AS questionNo, q.title AS title, q.difficulty AS difficulty, q.global_freq AS globalFreq, q.last_seen AS lastSeen, q.url AS url, ${companyFreqExpr} AS companyFreq FROM codetop_questions q ${joinClause}${whereClause}${orderClause} LIMIT ? OFFSET ?`,
      )
      .bind(...joinParams, ...whereParams, query.pageSize, offset)
      .all<QuestionRow>();
    console.log(`[db] listQuestions rows=${results.length} total=${total} page=${page}`);

    const questionNos = results.map((row) => row.questionNo);
    const counts = await countCompaniesByQuestion(database, questionNos);

    const items = results.flatMap<QuestionSummary>((row) => {
      const difficulty = toDifficulty(row.difficulty);
      if (difficulty === null) return [];
      return [
        {
          questionNo: row.questionNo,
          title: row.title,
          difficulty,
          freq: row.companyFreq ?? row.globalFreq,
          companyCount: counts.get(row.questionNo) ?? 0,
          lastSeen: row.lastSeen,
          url: row.url,
        },
      ];
    });

    return { items, total, totalPages };
  });
}

async function countCompaniesByQuestion(
  database: typeof env.leetcode_db,
  questionNos: readonly string[],
): Promise<ReadonlyMap<string, number>> {
  if (questionNos.length === 0) return new Map();
  const placeholders = questionNos.map(() => "?").join(", ");
  const { results } = await database
    .prepare(
      `SELECT question_no AS questionNo, COUNT(*) AS companyCount FROM codetop_company_questions WHERE question_no IN (${placeholders}) GROUP BY question_no`,
    )
    .bind(...questionNos)
    .all<CountRow>();
  return new Map(results.map((row) => [row.questionNo, row.companyCount]));
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}
