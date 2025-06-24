import { IUser } from './user.types';

declare module 'express' {
  interface Request {
    user?: IUser;
  }
}
