import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { paginationRange, questionHref, type QuestionFilterState } from "@/lib/query";
import { cn } from "@/lib/utils";

interface QuestionPaginationProps {
  readonly filters: QuestionFilterState;
  readonly totalPages: number;
}

export function QuestionPagination({ filters, totalPages }: QuestionPaginationProps) {
  const pages = paginationRange(filters.page, totalPages);

  return (
    <nav aria-label="分页" className="flex w-full items-center justify-between gap-2">
      <span className="text-muted-foreground text-xs">
        第 {filters.page} / {totalPages} 页
      </span>
      <div className="flex items-center gap-1">
        {filters.page > 1 ? (
          <Link
            href={questionHref({ ...filters, page: filters.page - 1 })}
            aria-label="上一页"
            className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
          >
            <ChevronLeftIcon />
          </Link>
        ) : (
          <span
            aria-disabled
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "opacity-50")}
          >
            <ChevronLeftIcon />
          </span>
        )}
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="text-muted-foreground flex size-7 items-center justify-center text-xs"
            >
              …
            </span>
          ) : (
            <Link
              key={page}
              href={questionHref({ ...filters, page })}
              aria-current={page === filters.page ? "page" : undefined}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "px-0 text-xs tabular-nums",
                page === filters.page && "bg-muted text-foreground",
              )}
            >
              {page}
            </Link>
          ),
        )}
        {filters.page < totalPages ? (
          <Link
            href={questionHref({ ...filters, page: filters.page + 1 })}
            aria-label="下一页"
            className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
          >
            <ChevronRightIcon />
          </Link>
        ) : (
          <span
            aria-disabled
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "opacity-50")}
          >
            <ChevronRightIcon />
          </span>
        )}
      </div>
    </nav>
  );
}
