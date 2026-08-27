import { SparklesIcon } from "lucide-react";

import { QuestionFilters } from "@/components/question-filters";
import { QuestionPagination } from "@/components/question-pagination";
import { QuestionTable } from "@/components/question-table";
import { StatsSection } from "@/components/stats-section";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getOverview, listCompanies, listQuestions } from "@/lib/db";
import { formatNumber } from "@/lib/format";
import { PAGE_SIZE, parseQuestionFilters } from "@/lib/query";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const filters = parseQuestionFilters(params);
  const [overview, companies, questionPage] = await Promise.all([
    getOverview(),
    listCompanies(),
    listQuestions({
      keyword: filters.keyword,
      difficulty: filters.difficulty,
      company: filters.company,
      page: filters.page,
      pageSize: PAGE_SIZE,
    }),
  ]);

  const maxFreq = questionPage.items.reduce((max, item) => Math.max(max, item.freq), 1);

  return (
    <main className="flex flex-col">
      <section className="bg-muted/40 border-b">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-3 px-4 py-10 sm:px-6 sm:py-12">
          <Badge variant="outline" className="bg-background gap-1.5">
            <SparklesIcon data-icon="inline-start" />
            数据持续更新中
          </Badge>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            大厂面试高频题，按真实频率排序
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm leading-6 sm:text-base sm:leading-7">
            汇总字节跳动、腾讯、微软等 {overview.companyCount} 家公司的{" "}
            {formatNumber(overview.totalQuestions)} 道算法真题，帮你把时间花在最高频的题目上。
          </p>
        </div>
      </section>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
        <StatsSection overview={overview} />
        <QuestionFilters
          companies={companies}
          keyword={filters.keyword}
          difficulty={filters.difficulty}
          company={filters.company}
        />
        <Card>
          <CardHeader className="border-b">
            <CardTitle>题目频率榜</CardTitle>
            <CardDescription>
              共 {formatNumber(questionPage.total)} 道题目匹配当前筛选
            </CardDescription>
            <CardAction>
              <Badge variant="secondary">按频率排序</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="px-0">
            <QuestionTable items={questionPage.items} maxFreq={maxFreq} />
          </CardContent>
          {questionPage.totalPages > 1 && (
            <CardFooter>
              <QuestionPagination filters={filters} totalPages={questionPage.totalPages} />
            </CardFooter>
          )}
        </Card>
      </div>
    </main>
  );
}
