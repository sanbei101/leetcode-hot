export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs sm:flex-row sm:px-6">
        <p>数据来源于 CodeTop 社区公开统计，仅供学习参考。</p>
        <p>基于 vinext · Cloudflare Workers · shadcn/ui 构建</p>
      </div>
    </footer>
  );
}
