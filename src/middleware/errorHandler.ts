import { Request, Response, NextFunction } from 'express';
import { Logger } from '@/utils/logger';

/**
 * Custom error handling middleware.
 * @param err - The error object.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 */
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  Logger.error(err.stack ?? 'Something went wrong!');
  res.status(500).json({ message: 'Something went wrong!' });
};

export default errorHandler;
