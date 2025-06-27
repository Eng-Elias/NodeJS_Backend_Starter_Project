import { Request, Response, NextFunction } from 'express';
import { DbInjectionSanitizeUtils } from '@/utils/DbInjectionSanitizeUtils';

/**
 * Middleware to sanitize request body, query, and params to prevent NoSQL injection attacks.
 */
export const mongoSanitizeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body) {
    req.body = DbInjectionSanitizeUtils.mongoSanitize(req.body);
  }
  if (req.query) {
    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        const value = req.query[key];
        (req.query as any)[key] = DbInjectionSanitizeUtils.mongoSanitize(value);
      }
    }
  }
  if (req.params) {
    req.params = DbInjectionSanitizeUtils.mongoSanitize(req.params);
  }
  next();
};
