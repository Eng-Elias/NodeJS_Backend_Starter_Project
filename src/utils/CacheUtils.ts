import { redisClient } from '@/app';
import { Logger } from '@/utils/logger';

export const CACHE_PREFIX = 'cache:';
export const CACHE_PATTERNS = {
  USERS: `${CACHE_PREFIX}:/api/v1/users*`,
};

/**
 * Utility class for interacting with the Redis cache.
 */
export class CacheUtils {
  /**
   * Retrieves a value from the cache.
   * @param key The cache key.
   * @returns The cached value, or null if not found.
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch (error) {
      Logger.error(`Error getting cache for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Stores a value in the cache.
   * @param key The cache key.
   * @param value The value to store.
   * @param ttlSeconds Time-to-live in seconds.
   */
  static async set<T>(
    key: string,
    value: T,
    ttlSeconds: number,
  ): Promise<void> {
    try {
      await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
    } catch (error) {
      Logger.error(`Error setting cache for key ${key}:`, error);
    }
  }

  /**
   * Deletes a value from the cache.
   * @param key The cache key.
   */
  static async del(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      Logger.error(`Error deleting cache for key ${key}:`, error);
    }
  }

  /**
   * Deletes all keys matching a pattern.
   * Useful for cache invalidation, e.g., clearing all users cache.
   * @param pattern The pattern to match (e.g., 'users:*').
   */
  static async delByPattern(pattern: string): Promise<void> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      Logger.error(`Error deleting cache for pattern ${pattern}:`, error);
    }
  }

  static async clear(): Promise<void> {
    try {
      await redisClient.flushdb();
    } catch (error) {
      Logger.error(`Error clearing cache:`, error);
    }
  }
}
