import { IUser } from '@/models/user.model';

declare global {
  namespace Express {
    interface Request {
      /**
       * The authenticated user object attached to the request.
       * This is added by the 'protect' middleware.
       */
      user?: IUser;
    }
  }
}
