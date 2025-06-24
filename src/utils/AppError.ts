import { ApiUtils } from './ApiUtils';

export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? ApiUtils.API_STATUS.FAIL : ApiUtils.API_STATUS.ERROR;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
