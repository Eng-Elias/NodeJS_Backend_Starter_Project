import { Request, Response, NextFunction } from 'express';
import { XssUtils } from '@/utils/XssUtils';

/**
 * Middleware to sanitize request body, query, and params to prevent XSS attacks.
 */
export const xssMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = XssUtils.escape(req.body);
  }
  if (req.query) {
    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        const value = req.query[key];
        (req.query as any)[key] = XssUtils.escape(value);
      }
    }
  }
  if (req.params) {
    req.params = XssUtils.escape(req.params);
  }
  next();
};
