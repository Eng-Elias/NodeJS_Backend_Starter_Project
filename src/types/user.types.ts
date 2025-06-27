import { ObjectId } from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';
import { JwtPayload } from 'jsonwebtoken';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface IUserProfile {
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface IUserPreferences {
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    sms: boolean;
  };
}

export interface IUser extends SoftDeleteDocument {
  _id: ObjectId | string;
  username: string;
  email: string;
  password?: string;
  profile: IUserProfile;
  preferences: IUserPreferences;
  roles: UserRole[];
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshTokens?: string[];
  lastLogin?: Date;
}

/**
 * Extends the default JWT payload with a custom 'id' field.
 */
export interface CustomJwtPayload extends JwtPayload {
  id: string;
}
