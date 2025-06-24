import { Schema, model } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import { IUser, UserRole } from '@/types/user.types';
import { CryptoUtils } from '@/utils/CryptoUtils';
import { auditPlugin } from './plugins/audit.plugin';

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, select: false },
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      avatar: { type: String },
    },
    preferences: {
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
    },
    roles: {
      type: [String],
      enum: Object.values(UserRole),
      default: [UserRole.USER],
    },
    lastLogin: { type: Date },
  },
  { timestamps: true },
);

// Plugins
userSchema.plugin(auditPlugin);
userSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

// Hooks
userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await CryptoUtils.hashPassword(this.password);
  }
  next();
});

export const User = model<IUser>('User', userSchema);
