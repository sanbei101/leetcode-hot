import { listQuestions } from "@/lib/db";
import { PAGE_SIZE, parseQuestionFilters, type SearchParams } from "@/lib/query";

export const dynamic = "force-dynamic";

function readSearchParams(url: URL): SearchParams {
  const params: SearchParams = {};
  url.searchParams.forEach((value, key) => {
    const existing = params[key];
    if (existing === undefined) {
      params[key] = value;
    } else if (Array.isArray(existing)) {
      existing.push(value);
    } else {
      params[key] = [existing, value];
    }
  });
  return params;
}

export async function GET(request: Request): Promise<Response> {
  const filters = parseQuestionFilters(readSearchParams(new URL(request.url)));
  const page = await listQuestions({
    keyword: filters.keyword,
    difficulty: filters.difficulty,
    company: filters.company,
    page: filters.page,
    pageSize: PAGE_SIZE,
  });

  return Response.json(page, { headers: { "cache-control": "no-store" } });
}
