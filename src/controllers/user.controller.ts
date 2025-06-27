import { Request, Response, NextFunction } from 'express';
import { User } from '@/models/user.model';
import { catchAsync } from '@/utils/catchAsync';
import { PaginationUtils } from '@/utils/PaginationUtils';
import { ApiUtils } from '@/utils/ApiUtils';

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { limit, skip, page } = PaginationUtils.getPagination(req);

    const users = await User.find().skip(skip).limit(limit);
    const totalUsers = await User.countDocuments();

    const paginationData = {
      total: totalUsers,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
    };

    res.status(200).json({
      status: ApiUtils.API_STATUS.SUCCESS,
      data: { users, pagination: paginationData },
    });
  },
);
