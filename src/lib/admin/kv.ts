import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { Redis } from "@upstash/redis";

/**
 * Tiny persistence layer for the admin dashboard.
 *
 * - Production: Vercel KV / Upstash Redis. Reads the REST URL + token from
 *   whatever prefix the storage integration used (KV_*, UPSTASH_REDIS_*, or
 *   a custom "<PREFIX>_REST_API_URL" / "<PREFIX>_REST_API_TOKEN" pair).
 * - No Redis env configured: a JSON file under the OS temp dir. Fine for
 *   local dev; on serverless it is per-instance and ephemeral, so attach a
 *   Redis store for anything real.
 *
 * The data set for a single-location kitchen is small (hundreds of orders),
 * so every collection is stored as one JSON document under a single key.
 */

export interface KvBackend {
  read<T>(key: string): Promise<T | null>;
  write<T>(key: string, value: T): Promise<void>;
}

function resolveRedisCreds(): { url: string; token: string } | null {
  const env = process.env;

  const known: Array<[string | undefined, string | undefined]> = [
    [env.KV_REST_API_URL, env.KV_REST_API_TOKEN],
    [env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN],
    [env.REDIS_REST_API_URL, env.REDIS_REST_API_TOKEN],
    [env.STORAGE_REST_API_URL, env.STORAGE_REST_API_TOKEN],
  ];
  for (const [url, token] of known) {
    if (url && token) return { url, token };
  }

  // Any "<PREFIX>_REST_API_URL" with a matching "<PREFIX>_REST_API_TOKEN".
  const SUFFIX = "_REST_API_URL";
  for (const key of Object.keys(env)) {
    if (!key.endsWith(SUFFIX)) continue;
    const url = env[key];
    const token = env[`${key.slice(0, -SUFFIX.length)}_REST_API_TOKEN`];
    if (url && token) return { url, token };
  }
  return null;
}

const redisCreds = resolveRedisCreds();
export const usingRedis = redisCreds !== null;

function redisBackend(creds: { url: string; token: string }): KvBackend {
  const redis = new Redis(creds);
  return {
    // Upstash auto-serialises JSON on set and parses on get.
    read: <T>(key: string) => redis.get<T>(key).then((v) => v ?? null),
    write: async (key, value) => {
      await redis.set(key, value);
    },
  };
}

function fileBackend(): KvBackend {
  const file = path.join(os.tmpdir(), "samya-admin-store.json");
  let chain: Promise<unknown> = Promise.resolve();

  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[admin] No Redis env found — using an ephemeral file store at " +
        `${file}. Attach a Redis store and redeploy for real persistence.`,
    );
  }

  async function load(): Promise<Record<string, unknown>> {
    try {
      return JSON.parse(await fs.readFile(file, "utf8")) as Record<
        string,
        unknown
      >;
    } catch {
      return {};
    }
  }

  function locked<T>(fn: () => Promise<T>): Promise<T> {
    const run = chain.then(fn, fn);
    chain = run.then(
      () => undefined,
      () => undefined,
    );
    return run as Promise<T>;
  }

  return {
    read: <T>(key: string) =>
      locked(async () => ((await load())[key] as T) ?? null),
    write: (key, value) =>
      locked(async () => {
        const data = await load();
        data[key] = value;
        await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
      }),
  };
}

export const kv: KvBackend = redisCreds
  ? redisBackend(redisCreds)
  : fileBackend();
