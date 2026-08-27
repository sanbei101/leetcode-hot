import { Badge } from "@/components/ui/badge";
import { DIFFICULTY_LABELS, type Difficulty } from "@/lib/types";

const difficultyClassName: Readonly<Record<Difficulty, string>> = {
  easy: "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  medium: "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  hard: "border-transparent bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
};

export function DifficultyBadge({ difficulty }: { readonly difficulty: Difficulty }) {
  return (
    <Badge variant="outline" className={difficultyClassName[difficulty]}>
      {DIFFICULTY_LABELS[difficulty]}
    </Badge>
  );
}
