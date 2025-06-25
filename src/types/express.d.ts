import { JwtPayload } from 'jsonwebtoken';
import { IUser } from '@/models/user.model';

/**
 * Extends the default JWT payload with a custom 'id' field.
 */
export interface CustomJwtPayload extends JwtPayload {
  id: string;
}

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
