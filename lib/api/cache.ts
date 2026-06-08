/**
 * Tiny in-memory TTL cache. Cuts cost and upstream load for short-lived data
 * (WHOIS/DNS ~minutes).
 *
 * NOTE: this is per-instance and ephemeral — fine as the reference and for
 * dev/single-instance, but in serverless each cold start gets an empty cache.
 * For production swap the body for managed KV/Redis (e.g. Upstash); the
 * signature stays the same so callers don't change.
 */

interface Entry {
  value: unknown;
  expires: number;
}

const store = new Map<string, Entry>();

export async function cached<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>,
): Promise<{ value: T; cached: boolean }> {
  const now = Date.now();
  const hit = store.get(key);
  if (hit && hit.expires > now) {
    return { value: hit.value as T, cached: true };
  }
  const value = await fn();
  store.set(key, { value, expires: now + ttlMs });

  // opportunistic eviction so the map can't grow unbounded
  if (store.size > 500) {
    for (const [k, v] of store) {
      if (v.expires <= now) store.delete(k);
    }
  }
  return { value, cached: false };
}
