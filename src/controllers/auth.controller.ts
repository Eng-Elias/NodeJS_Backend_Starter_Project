import { Request, Response, NextFunction } from 'express';
import { User } from '@/models/user.model';
import { AuthUtils } from '@/utils/AuthUtils';
import { EmailUtils } from '@/utils/EmailUtils';
import { AppError } from '@/utils/AppError';
import { catchAsync } from '@/utils/catchAsync';

// Utility to send tokens in response
const createSendToken = (user: any, statusCode: number, res: Response) => {
  const accessToken = AuthUtils.generateAccessToken({ id: user._id });
  const refreshToken = AuthUtils.generateRefreshToken({ id: user._id });

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    refreshToken,
    data: {
      user,
    },
  });
};

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, firstName, lastName } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('An account with this email already exists.', 400));
  }

  const newUser = await User.create({
    email,
    password,
    profile: { firstName, lastName },
  });

  const { token: verificationToken, hashedToken } = AuthUtils.generateVerificationToken();
  newUser.emailVerificationToken = hashedToken;
  newUser.emailVerificationTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await newUser.save({ validateBeforeSave: false });

  try {
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verificationToken}`;
    await EmailUtils.sendEmail(
      newUser.email,
      'Verify your email address',
      `Please click the following link to verify your email address: ${verificationUrl}`,
      `<p>Please click the following link to verify your email address: <a href="${verificationUrl}">${verificationUrl}</a></p>`
    );

    res.status(201).json({
      status: 'success',
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (error) {
    newUser.emailVerificationToken = undefined;
    newUser.emailVerificationTokenExpires = undefined;
    await newUser.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the verification email. Please try again later.', 500));
  }
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !user.password || !(await AuthUtils.comparePassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (!user.isEmailVerified) {
    return next(new AppError('Please verify your email address before logging in.', 401));
  }

  createSendToken(user, 200, res);
});
