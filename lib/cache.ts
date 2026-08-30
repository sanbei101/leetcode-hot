import { env } from "cloudflare:workers";

const KEY_PREFIX = "cache:v1:";

export const CACHE_TTL_SECONDS = {
  questionList: 300,
  reference: 900,
} as const;

export async function cachedJson<T>(
  key: string,
  ttlSeconds: number,
  compute: () => Promise<T>,
): Promise<T> {
  const cacheKey = `${KEY_PREFIX}${key}`;
  try {
    const hit = await env.CACHE_KV.get(cacheKey, "json");
    if (hit !== null) {
      console.log(`[cache] hit ${cacheKey}`);
      return hit as T;
    }
  } catch (error) {
    console.error(`[cache] read failed: ${cacheKey}`, error);
  }

  const value = await compute();

  try {
    await env.CACHE_KV.put(cacheKey, JSON.stringify(value), {
      expirationTtl: ttlSeconds,
    });
  } catch (error) {
    console.error(`[cache] write failed: ${cacheKey}`, error);
  }
  return value;
}
