import { env } from "cloudflare:workers"

export default async function TestPage() {
  console.log("[test] start, env keys:", Object.keys(env).join(","))
  const database = env.leetcode_db
  console.log("[test] binding:", typeof database)
  try {
    console.log("[test] querying...")
    const result = await database
      .prepare("SELECT COUNT(*) AS total FROM codetop_questions")
      .first<{ readonly total: number }>()
    console.log("[test] result:", result)
    return <main className="p-8">test-ok {result?.total}</main>
  } catch (error) {
    console.error("[test] caught:", error)
    return (
      <main className="p-8">
        test-error {String(error)}
      </main>
    )
  }
}
