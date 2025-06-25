import { Request, Response, NextFunction } from 'express';

/**
 * Custom timeout middleware.
 * @param timeoutMs The timeout in milliseconds.
 */
export const customTimeout = (timeoutMs: number) => (req: Request, res: Response, next: NextFunction) => {
  const timeoutId = setTimeout(() => {
    if (!res.headersSent) {
      res.status(503).send({ status: 'error', message: 'Service timeout. Please try again later.' });
    }
  }, timeoutMs);

  const originalEnd = res.end.bind(res);
  res.end = ((...args: any[]) => {
    clearTimeout(timeoutId);
    originalEnd(...args);
  }) as any;

  next();
};
