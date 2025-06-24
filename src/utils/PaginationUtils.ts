import { Request } from 'express';

export interface IPagination {
  limit: number;
  skip: number;
  page: number;
}

export class PaginationUtils {
  /**
   * Calculates pagination parameters from the request query.
   * @param req The Express request object.
   * @returns An object containing limit, skip, and page number.
   */
  public static getPagination(req: Request): IPagination {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    return { limit, skip, page };
  }
}
