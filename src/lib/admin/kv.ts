import { promises as fs } from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";

/**
 * Tiny persistence layer for the admin dashboard.
 *
 * - Production: Vercel KV / Upstash Redis (whichever KV_REST_API_* or
 *   UPSTASH_REDIS_REST_* env vars the storage integration provides).
 * - Local dev with no KV configured: a JSON file at `.data/admin-store.json`
 *   (git-ignored). Same interface, so nothing else has to care.
 *
 * The data set for a single-location kitchen is small (hundreds of orders),
 * so every collection is stored as one JSON document under a single key.
 */

export interface KvBackend {
  read<T>(key: string): Promise<T | null>;
  write<T>(key: string, value: T): Promise<void>;
}

const REDIS_URL =
  process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const usingRedis = Boolean(REDIS_URL && REDIS_TOKEN);

function redisBackend(): KvBackend {
  const redis = new Redis({ url: REDIS_URL!, token: REDIS_TOKEN! });
  return {
    // Upstash auto-serialises JSON on set and parses on get.
    read: <T>(key: string) => redis.get<T>(key).then((v) => v ?? null),
    write: async (key, value) => {
      await redis.set(key, value);
    },
  };
}

function fileBackend(): KvBackend {
  const file = path.join(process.cwd(), ".data", "admin-store.json");
  let chain: Promise<unknown> = Promise.resolve();

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
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
      }),
  };
}

export const kv: KvBackend = usingRedis ? redisBackend() : fileBackend();
