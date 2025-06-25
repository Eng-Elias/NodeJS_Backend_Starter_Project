import { Request, Response, NextFunction } from 'express';
import { User } from '@/models/user.model';
import { AuthUtils } from '@/utils/AuthUtils';
import { AppError } from '@/utils/AppError';
import { catchAsync } from '@/utils/catchAsync';
import { CustomJwtPayload } from '@/types/user.types';

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError({ message: 'You are not logged in! Please log in to get access.', statusCode: 401 }));
  }

  const decoded = AuthUtils.verifyAccessToken(token) as CustomJwtPayload;

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError({ message: 'The user belonging to this token no longer exists.', statusCode: 401 }));
  }

  req.user = currentUser;
  next();
});
