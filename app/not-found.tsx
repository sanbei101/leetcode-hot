import { CompassIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-24 sm:px-6">
      <Card size="sm" className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
            <CompassIcon className="size-6" />
          </span>
          <p className="text-lg font-semibold">页面不存在</p>
          <p className="text-muted-foreground text-sm">你要找的页面可能已被移动或删除。</p>
          <Button render={<Link href="/" />}>返回首页</Button>
        </CardContent>
      </Card>
    </main>
  );
}
