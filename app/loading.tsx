import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex flex-col">
      <section className="bg-muted/40 border-b">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-10 sm:px-6 sm:py-12">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-9 w-80 max-w-full" />
          <Skeleton className="h-6 w-96 max-w-full" />
        </div>
      </section>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((index) => (
            <Skeleton key={index} className="h-[4.75rem] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-[32rem] rounded-xl" />
      </div>
    </main>
  );
}
