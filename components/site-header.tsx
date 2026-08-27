import { CodeXmlIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
            <CodeXmlIcon className="size-4" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">CodeTop 热题榜</span>
            <span className="text-muted-foreground text-xs">大厂算法面试高频题</span>
          </span>
        </Link>
        <div className="flex items-center gap-1.5">
          <Badge variant="secondary" className="hidden sm:inline-flex">
            每日更新
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            render={<a href="https://codetop.cn" target="_blank" rel="noreferrer" />}
          >
            数据来源
            <ExternalLinkIcon data-icon="inline-end" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
