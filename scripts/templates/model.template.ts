import { Schema, model, Document } from 'mongoose';
import { I__MODULE_NAME__ } from '../types/__MODULE_NAME_LOWERCASE__.types';

const __MODULE_NAME_LOWERCASE__Schema = new Schema<I__MODULE_NAME__>(
  {
    __SCHEMA_FIELDS__,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const __MODULE_NAME__Model = model<I__MODULE_NAME__>(
  '__MODULE_NAME__',
  __MODULE_NAME_LOWERCASE__Schema,
);
