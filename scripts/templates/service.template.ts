import { __MODULE_NAME__Model } from '../models/__MODULE_NAME__';
import { I__MODULE_NAME__ } from '../types/__MODULE_NAME_LOWERCASE__.types';
import { AppError } from '../utils/AppError';

export class __MODULE_NAME__Service {
  static async create__MODULE_NAME__(data: Partial<I__MODULE_NAME__>) {
    const new__MODULE_NAME__ = await __MODULE_NAME__Model.create(data);
    return new__MODULE_NAME__;
  }

  static async get__MODULE_NAME__ById(id: string) {
    const __MODULE_NAME_LOWERCASE__ = await __MODULE_NAME__Model.findById(id);
    if (!__MODULE_NAME_LOWERCASE__) {
      throw new AppError({
        statusCode: 404,
        message: '__MODULE_NAME__ not found',
      });
    }
    return __MODULE_NAME_LOWERCASE__;
  }

  static async getAll__MODULE_NAME__s(query: any) {
    const __MODULE_NAME_LOWERCASE__s = await __MODULE_NAME__Model.find(query);
    return __MODULE_NAME_LOWERCASE__s;
  }

  static async update__MODULE_NAME__(
    id: string,
    data: Partial<I__MODULE_NAME__>,
  ) {
    const updated__MODULE_NAME__ = await __MODULE_NAME__Model.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updated__MODULE_NAME__) {
      throw new AppError({
        statusCode: 404,
        message: '__MODULE_NAME__ not found',
      });
    }
    return updated__MODULE_NAME__;
  }

  static async delete__MODULE_NAME__(id: string) {
    const deleted__MODULE_NAME__ =
      await __MODULE_NAME__Model.findByIdAndDelete(id);
    if (!deleted__MODULE_NAME__) {
      throw new AppError({
        statusCode: 404,
        message: '__MODULE_NAME__ not found',
      });
    }
  }
}
