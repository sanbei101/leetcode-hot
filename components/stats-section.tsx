import type { LucideIcon } from "lucide-react";
import { Building2Icon, CalendarClockIcon, DatabaseIcon, FlameIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import type { Overview } from "@/lib/types";

interface StatCard {
  readonly label: string;
  readonly value: string;
  readonly hint: string;
  readonly icon: LucideIcon;
}

export function StatsSection({ overview }: { readonly overview: Overview }) {
  const stats: readonly StatCard[] = [
    {
      label: "收录题目",
      value: formatNumber(overview.totalQuestions),
      hint: `简单 ${overview.byDifficulty.easy} · 中等 ${overview.byDifficulty.medium} · 困难 ${overview.byDifficulty.hard}`,
      icon: DatabaseIcon,
    },
    {
      label: "覆盖公司",
      value: String(overview.companyCount),
      hint: "字节 · 腾讯 · 微软 等",
      icon: Building2Icon,
    },
    {
      label: "最高热度",
      value: overview.hottest === null ? "—" : formatNumber(overview.hottest.freq),
      hint: overview.hottest?.title ?? "暂无数据",
      icon: FlameIcon,
    },
    {
      label: "最近更新",
      value: overview.lastSeen ?? "—",
      hint: "持续抓取最新面经",
      icon: CalendarClockIcon,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} size="sm">
          <CardContent className="flex items-center gap-3">
            <span className="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg">
              <stat.icon className="size-5" />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="text-muted-foreground text-xs">{stat.label}</span>
              <span className="truncate text-xl font-semibold tabular-nums">{stat.value}</span>
              <span className="text-muted-foreground truncate text-xs">{stat.hint}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
