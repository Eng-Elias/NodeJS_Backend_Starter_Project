import { Request, Response, NextFunction } from 'express';
import config from '@/config';
import { AppError } from '@/utils/AppError';
import { Logger } from '@/utils/logger';
import { ApiUtils } from '@/utils/ApiUtils';


export const AUTH_ERRORS = {
  JsonWebTokenError: 'JsonWebTokenError',
  TokenExpiredError: 'TokenExpiredError',
}

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  Logger.error('ERROR 💥', err);
  return res.status(500).json({
    status: ApiUtils.API_STATUS.ERROR,
    message: 'Something went very wrong!',
  });
};

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || ApiUtils.API_STATUS.ERROR;

  Logger.error('ERROR 💥', err);

  if (config.nodeEnv === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === AUTH_ERRORS.JsonWebTokenError) error = handleJWTError();
    if (error.name === AUTH_ERRORS.TokenExpiredError) error = handleJWTExpiredError();

    sendErrorProd(error, res);
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};
