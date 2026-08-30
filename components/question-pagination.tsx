"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { paginationRange, type PaginationItem } from "@/lib/query";
import { cn } from "@/lib/utils";

interface QuestionPaginationProps {
  readonly page: number;
  readonly totalPages: number;
  readonly disabled?: boolean;
  readonly onPageChange: (page: number) => void;
}

export function QuestionPagination({
  page,
  totalPages,
  disabled = false,
  onPageChange,
}: QuestionPaginationProps) {
  const pages = paginationRange(page, totalPages);

  const renderItem = (item: PaginationItem, index: number) => {
    if (item === "ellipsis") {
      return (
        <span
          key={`ellipsis-${index}`}
          className="text-muted-foreground flex size-7 items-center justify-center text-xs"
        >
          …
        </span>
      );
    }
    const isCurrent = item === page;
    return (
      <Button
        key={item}
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={disabled || isCurrent}
        aria-current={isCurrent ? "page" : undefined}
        aria-label={`第 ${item} 页`}
        onClick={() => onPageChange(item)}
        className={cn("px-0 text-xs tabular-nums", isCurrent && "bg-muted text-foreground")}
      >
        {item}
      </Button>
    );
  };

  return (
    <nav aria-label="分页" className="flex w-full items-center justify-between gap-2">
      <span className="text-muted-foreground text-xs">
        第 {page} / {totalPages} 页
      </span>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled || page <= 1}
          aria-label="上一页"
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon />
        </Button>
        {pages.map(renderItem)}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled || page >= totalPages}
          aria-label="下一页"
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </nav>
  );
}
