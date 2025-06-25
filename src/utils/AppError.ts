import { ApiUtils } from './ApiUtils';

export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor({
    message,
    statusCode,
    isOperational = true,
    stack = '',
  }: {
    message: string;
    statusCode: number;
    isOperational?: boolean;
    stack?: string;
  }) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? ApiUtils.API_STATUS.FAIL : ApiUtils.API_STATUS.ERROR;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
