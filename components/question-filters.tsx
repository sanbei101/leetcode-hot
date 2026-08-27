"use client";

import { BuildingIcon, SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CompanyFrequency, Difficulty } from "@/lib/types";
import { cn } from "@/lib/utils";

interface QuestionFiltersProps {
  readonly companies: readonly CompanyFrequency[];
  readonly keyword: string | null;
  readonly difficulty: Difficulty | null;
  readonly company: string | null;
}

export function QuestionFilters({ companies, keyword, difficulty, company }: QuestionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = React.useTransition();
  const [draft, setDraft] = React.useState(keyword ?? "");

  React.useEffect(() => {
    setDraft(keyword ?? "");
  }, [keyword]);

  const updateParam = React.useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "" || value === "all") params.delete(key);
      else params.set(key, value);
      params.delete("page");
      const query = params.toString();
      startTransition(() =>
        router.replace(query === "" ? pathname : `${pathname}?${query}`, { scroll: false }),
      );
    },
    [pathname, router, searchParams],
  );

  React.useEffect(() => {
    if (draft === (keyword ?? "")) return;
    const timer = window.setTimeout(() => updateParam("q", draft), 300);
    return () => window.clearTimeout(timer);
  }, [draft, keyword, updateParam]);

  return (
    <div
      aria-busy={pending}
      className={cn(
        "flex flex-col gap-3 transition-opacity lg:flex-row lg:items-center",
        pending && "pointer-events-none opacity-60",
      )}
    >
      <div className="relative flex-1">
        <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="搜索题号或题目名称…"
          aria-label="搜索题目"
          className="pl-8"
        />
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-start">
        <Tabs
          value={difficulty ?? "all"}
          onValueChange={(value) => updateParam("difficulty", value)}
        >
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="easy">简单</TabsTrigger>
            <TabsTrigger value="medium">中等</TabsTrigger>
            <TabsTrigger value="hard">困难</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={company ?? "all"} onValueChange={(value) => updateParam("company", value)}>
          <SelectTrigger className="w-40" aria-label="选择公司">
            <BuildingIcon className="text-muted-foreground size-3.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部公司</SelectItem>
            {companies.map((item) => (
              <SelectItem key={item.company} value={item.company}>
                {item.company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
