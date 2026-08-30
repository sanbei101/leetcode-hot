"use client";

import * as React from "react";

import { QuestionPagination } from "@/components/question-pagination";
import { QuestionTable } from "@/components/question-table";
import { CardFooter } from "@/components/ui/card";
import { questionApiHref, type QuestionFilterState } from "@/lib/query";
import type { QuestionPage, QuestionSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

interface QuestionTableBrowserProps {
  readonly filters: QuestionFilterState;
  readonly initialPage: QuestionPage;
}

function computeMaxFreq(items: readonly QuestionSummary[]): number {
  return items.reduce((max, item) => Math.max(max, item.freq), 1);
}

function syncUrlPage(page: number, mode: "push" | "replace"): void {
  const url = new URL(window.location.href);
  if (page > 1) url.searchParams.set("page", String(page));
  else url.searchParams.delete("page");
  const query = url.searchParams.toString();
  const href = query === "" ? url.pathname : `${url.pathname}?${query}`;
  if (href === `${window.location.pathname}${window.location.search}`) return;
  if (mode === "push") window.history.pushState(null, "", href);
  else window.history.replaceState(null, "", href);
}

export function QuestionTableBrowser({ filters, initialPage }: QuestionTableBrowserProps) {
  const [items, setItems] = React.useState(initialPage.items);
  const [maxFreq, setMaxFreq] = React.useState(() => computeMaxFreq(initialPage.items));
  const [page, setPage] = React.useState(filters.page);
  const [totalPages, setTotalPages] = React.useState(initialPage.totalPages);
  const [isPending, setIsPending] = React.useState(false);
  const requestIdRef = React.useRef(0);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const tableRegionRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(
    () => () => {
      requestIdRef.current += 1;
      abortControllerRef.current?.abort();
    },
    [],
  );

  const loadPage = React.useCallback(
    (nextPage: number, mode: "push" | "replace") => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsPending(true);

      void (async () => {
        try {
          const response = await fetch(questionApiHref({ ...filters, page: nextPage }), {
            signal: controller.signal,
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = (await response.json()) as QuestionPage;
          if (controller.signal.aborted || requestIdRef.current !== requestId) return;

          const settledPage = Math.max(1, Math.min(nextPage, data.totalPages));
          setItems(data.items);
          setMaxFreq(computeMaxFreq(data.items));
          setTotalPages(data.totalPages);
          setPage(settledPage);
          syncUrlPage(settledPage, mode);

          const region = tableRegionRef.current;
          if (region !== null && region.getBoundingClientRect().top < 0) {
            region.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } catch (error) {
          if ((error as Error | undefined)?.name !== "AbortError") {
            console.error("[questions] 翻页加载失败", error);
          }
        } finally {
          if (requestIdRef.current === requestId) setIsPending(false);
        }
      })();
    },
    [filters],
  );

  return (
    <>
      <div
        ref={tableRegionRef}
        aria-busy={isPending}
        className={cn(
          "scroll-mt-24 transition-opacity",
          isPending && "pointer-events-none opacity-60",
        )}
      >
        <QuestionTable items={items} maxFreq={maxFreq} />
      </div>
      {totalPages > 1 && (
        <CardFooter className="mt-(--card-spacing)">
          <QuestionPagination
            page={page}
            totalPages={totalPages}
            disabled={isPending}
            onPageChange={(next) => {
              if (next !== page) loadPage(next, "push");
            }}
          />
        </CardFooter>
      )}
    </>
  );
}
