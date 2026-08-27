import { SearchXIcon } from "lucide-react";

import { DifficultyBadge } from "@/components/difficulty-badge";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber } from "@/lib/format";
import type { QuestionSummary } from "@/lib/types";

interface QuestionTableProps {
  readonly items: readonly QuestionSummary[];
  readonly maxFreq: number;
}

export function QuestionTable({ items, maxFreq }: QuestionTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
        <SearchXIcon className="text-muted-foreground size-8" />
        <p className="text-sm font-medium">没有找到匹配的题目</p>
        <p className="text-muted-foreground text-xs">试试调整关键词、难度或公司筛选条件</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableHead className="pl-4 sm:pl-6">#</TableHead>
          <TableHead>题目</TableHead>
          <TableHead>难度</TableHead>
          <TableHead>热度</TableHead>
          <TableHead className="text-right">公司</TableHead>
          <TableHead className="pr-4 text-right sm:pr-6">最近出现</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.questionNo}>
            <TableCell className="text-muted-foreground pl-4 font-mono text-xs sm:pl-6">
              {item.questionNo}
            </TableCell>
            <TableCell className="max-w-64 truncate font-medium">
              {item.url === null ? (
                item.title
              ) : (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  {item.title}
                </a>
              )}
            </TableCell>
            <TableCell>
              <DifficultyBadge difficulty={item.difficulty} />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress
                  value={maxFreq > 0 ? (item.freq / maxFreq) * 100 : 0}
                  className="w-24"
                  aria-label={`热度 ${formatNumber(item.freq)}`}
                />
                <span className="text-muted-foreground w-14 text-right text-xs tabular-nums">
                  {formatNumber(item.freq)}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Badge variant="secondary">{formatNumber(item.companyCount)} 家</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground pr-4 text-right text-xs sm:pr-6">
              {item.lastSeen ?? "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
