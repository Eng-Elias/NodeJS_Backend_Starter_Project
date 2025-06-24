import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/AppError';
import { UserRole } from '@/types/user.types';

export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roles) {
      return next(new AppError('User not found or roles not defined.', 403));
    }

    if (!roles.some(role => req.user!.roles.includes(role))) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};
