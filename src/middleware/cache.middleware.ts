import { Request, Response, NextFunction } from 'express';
import { CacheUtils } from '@/utils/CacheUtils';
import { Logger } from '@/utils/logger';

/**
 * Middleware to cache responses for GET requests.
 * @param ttlSeconds Time-to-live for the cache entry in seconds.
 */
export const cache =
  (ttlSeconds: number) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    const cachedData = await CacheUtils.get<any>(key);

    if (cachedData) {
      Logger.info(`Cache hit for key: ${key}`);
      res.status(200).json(cachedData);
      return;
    }

    Logger.info(`Cache miss for key: ${key}`);
    const originalJsonResFunction = res.json.bind(res);

    res.json = (body) => {
      CacheUtils.set(key, body, ttlSeconds);
      return originalJsonResFunction(body);
    };

    next();
  };
