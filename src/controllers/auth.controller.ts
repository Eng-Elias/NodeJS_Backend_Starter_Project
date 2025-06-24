import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { User } from '@/models/user.model';
import { AuthUtils } from '@/utils/AuthUtils';
import { ApiUtils } from '@/utils/ApiUtils';
import { EmailUtils } from '@/utils/EmailUtils';
import { AppError } from '@/utils/AppError';
import { catchAsync } from '@/utils/catchAsync';
import config from '@/config';

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, firstName, lastName } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('An account with this email already exists.', 400));
  }

  const newUser = await User.create({
    username,
    email,
    password,
    profile: { firstName, lastName },
  });

  if (config.email.verificationEnabled) {
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
        status: ApiUtils.API_STATUS.SUCCESS,
        message: 'Registration successful. Please check your email to verify your account.',
      });
    } catch (error) {
      newUser.emailVerificationToken = undefined;
      newUser.emailVerificationTokenExpires = undefined;
      await newUser.save({ validateBeforeSave: false });
      return next(new AppError('There was an error sending the verification email. Please try again later.', 500));
    }
  } else {
    const accessToken = AuthUtils.generateAccessToken({ id: newUser._id });
    const refreshToken = AuthUtils.generateRefreshToken({ id: newUser._id });
    newUser.refreshTokens = [refreshToken];
    await newUser.save();

    // Remove password from response
    newUser.password = undefined;

    res.status(201).json({
      status: ApiUtils.API_STATUS.SUCCESS,
      accessToken,
      refreshToken,
      data: { user: newUser },
    });
  }
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password +refreshTokens');

  if (!user || !user.password || !(await AuthUtils.comparePassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (config.email.verificationEnabled && !user.isEmailVerified) {
    return next(new AppError('Please verify your email address before logging in.', 401));
  }

  const accessToken = AuthUtils.generateAccessToken({ id: user._id });
  const refreshToken = AuthUtils.generateRefreshToken({ id: user._id });

  user.refreshTokens = [...(user.refreshTokens || []), refreshToken];
  await user.save();

  user.password = undefined;

  res.status(200).json({
    status: ApiUtils.API_STATUS.SUCCESS,
    accessToken,
    refreshToken,
    data: { user },
  });
});

export const verifyEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpires: { $gt: new Date() },
  }).select('+refreshTokens');

  if (!user) {
    return next(new AppError('Token is invalid or has expired.', 400));
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;

  const accessToken = AuthUtils.generateAccessToken({ id: user._id });
  const refreshToken = AuthUtils.generateRefreshToken({ id: user._id });

  user.refreshTokens = [...(user.refreshTokens || []), refreshToken];
  await user.save();

  user.password = undefined;

  res.status(200).json({
    status: ApiUtils.API_STATUS.SUCCESS,
    accessToken,
    refreshToken,
    data: { user },
  });
});

export const refresh = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return next(new AppError('Refresh token is required', 401));
  }

  const decoded = AuthUtils.verifyRefreshToken(refreshToken);
  if (!decoded || typeof decoded !== 'object' || !('id' in decoded) || typeof decoded.id !== 'string') {
    return next(new AppError('Invalid refresh token', 401));
  }

  const user = await User.findById(decoded.id).select('+refreshTokens');
  if (!user || !user.refreshTokens?.includes(refreshToken)) {
    return next(new AppError('Invalid refresh token', 401));
  }

  const accessToken = AuthUtils.generateAccessToken({ id: user._id });

  res.status(200).json({
    status: ApiUtils.API_STATUS.SUCCESS,
    accessToken,
  });
});

export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return next(new AppError('Refresh token is required', 401));
  }

  const decoded = AuthUtils.verifyRefreshToken(refreshToken);
  if (!decoded || typeof decoded !== 'object' || !('id' in decoded) || typeof decoded.id !== 'string') {
    res.status(200).json({ status: ApiUtils.API_STATUS.SUCCESS, message: 'Logged out' });
    return;
  }

  const user = await User.findById(decoded.id).select('+refreshTokens');
  if (user && user.refreshTokens) {
    user.refreshTokens = user.refreshTokens.filter((rt) => rt !== refreshToken);
    await user.save();
  }

  res.status(200).json({ status: ApiUtils.API_STATUS.SUCCESS, message: 'Logged out successfully' });
});

export const resendVerificationEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('No user found with that email address.', 404));
  }

  if (user.isEmailVerified) {
    return next(new AppError('This email is already verified.', 400));
  }

  const { token: verificationToken, hashedToken } = AuthUtils.generateVerificationToken();
  user.emailVerificationToken = hashedToken;
  user.emailVerificationTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save();

  try {
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verificationToken}`;
    await EmailUtils.sendEmail(
      user.email,
      'Verify your email address (Resend)',
      `Please click the following link to verify your email address: ${verificationUrl}`,
      `<p>Please click the following link to verify your email address: <a href="${verificationUrl}">${verificationUrl}</a></p>`
    );

    res.status(200).json({ status: ApiUtils.API_STATUS.SUCCESS, message: 'Verification email sent.' });
  } catch (error) {
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();
    return next(new AppError('There was an error sending the verification email. Please try again later.', 500));
  }
});

export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('No user found with that email address.', 404));
  }

  const { token: resetToken, hashedToken } = AuthUtils.generateVerificationToken();
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save();

  try {
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;
    await EmailUtils.sendEmail(
      user.email,
      'Your password reset token (valid for 10 minutes)',
      `To reset your password, please click the following link: ${resetUrl}`,
      `<p>To reset your password, please click the following link: <a href="${resetUrl}">${resetUrl}</a></p>`
    );

    res.status(200).json({ status: ApiUtils.API_STATUS.SUCCESS, message: 'Password reset token sent to email.' });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return next(new AppError('There was an error sending the password reset email. Please try again later.', 500));
  }
});

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select('+refreshTokens');

  if (!user) {
    return next(new AppError('Token is invalid or has expired.', 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // Invalidate all existing sessions by clearing refresh tokens
  user.refreshTokens = [];

  await user.save();

  const accessToken = AuthUtils.generateAccessToken({ id: user._id });
  const refreshToken = AuthUtils.generateRefreshToken({ id: user._id });

  user.refreshTokens = [refreshToken];
  await user.save();

  user.password = undefined;

  res.status(200).json({
    status: ApiUtils.API_STATUS.SUCCESS,
    accessToken,
    refreshToken,
    data: { user },
  });
});
