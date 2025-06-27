import { Request, Response } from 'express';
import { __MODULE_NAME__Model } from '@/models/__MODULE_NAME_LOWERCASE__.model';
import { ApiUtils } from '@/utils/ApiUtils';
import { AppError } from '@/utils/AppError';
import { catchAsync } from '@/utils/catchAsync';
import { ValidationUtils } from '@/utils/ValidationUtils';
import Joi from 'joi';

const create__MODULE_NAME__Schema = Joi.object({
  __VALIDATION_FIELDS__,
});

export class __MODULE_NAME__Controller {
  static create__MODULE_NAME__ = catchAsync(
    async (req: Request, res: Response) => {
      const validatedData = ValidationUtils.validate(
        create__MODULE_NAME__Schema,
        req.body,
      );
      const new__MODULE_NAME__ =
        await __MODULE_NAME__Model.create(validatedData);
      res
        .status(201)
        .json({
          status: ApiUtils.API_STATUS.SUCCESS,
          data: new__MODULE_NAME__,
        });
    },
  );

  static get__MODULE_NAME__ = catchAsync(
    async (req: Request, res: Response) => {
      const __MODULE_NAME_LOWERCASE__ = await __MODULE_NAME__Model.findById(
        req.params.id,
      );
      if (!__MODULE_NAME_LOWERCASE__) {
        throw new AppError({
          statusCode: 404,
          message: '__MODULE_NAME__ not found',
        });
      }
      res
        .status(200)
        .json({
          status: ApiUtils.API_STATUS.SUCCESS,
          data: __MODULE_NAME_LOWERCASE__,
        });
    },
  );

  static getAll__MODULE_NAME__s = catchAsync(
    async (req: Request, res: Response) => {
      const __MODULE_NAME_LOWERCASE__s = await __MODULE_NAME__Model.find(
        req.query,
      );
      res
        .status(200)
        .json({
          status: ApiUtils.API_STATUS.SUCCESS,
          data: __MODULE_NAME_LOWERCASE__s,
        });
    },
  );

  static update__MODULE_NAME__ = catchAsync(
    async (req: Request, res: Response) => {
      const updated__MODULE_NAME__ =
        await __MODULE_NAME__Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
      if (!updated__MODULE_NAME__) {
        throw new AppError({
          statusCode: 404,
          message: '__MODULE_NAME__ not found',
        });
      }
      res
        .status(200)
        .json({
          status: ApiUtils.API_STATUS.SUCCESS,
          data: updated__MODULE_NAME__,
        });
    },
  );

  static delete__MODULE_NAME__ = catchAsync(
    async (req: Request, res: Response) => {
      const deleted__MODULE_NAME__ =
        await __MODULE_NAME__Model.findByIdAndDelete(req.params.id);
      if (!deleted__MODULE_NAME__) {
        throw new AppError({
          statusCode: 404,
          message: '__MODULE_NAME__ not found',
        });
      }
      res.status(204).json({ status: ApiUtils.API_STATUS.SUCCESS, data: null });
    },
  );
}
