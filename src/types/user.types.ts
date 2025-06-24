import { Document } from 'mongoose';

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

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  profile: IUserProfile;
  preferences: IUserPreferences;
  roles: UserRole[];
  lastLogin?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
