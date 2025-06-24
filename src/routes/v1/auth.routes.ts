import { Router } from 'express';
import {
  register,
  login,
  verifyEmail,
  refresh,
  logout,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
} from '@/controllers/auth.controller';
import { validateRequest } from '@/middleware/validation.middleware';
import { ValidationUtils } from '@/utils/ValidationUtils';
import { authRateLimiter } from '@/middleware/rateLimiter.middleware';

const router = Router();

router.post('/register', authRateLimiter, validateRequest(ValidationUtils.userCreateSchema), register);
router.post('/login', authRateLimiter, validateRequest(ValidationUtils.userLoginSchema), login);
router.post('/refresh', validateRequest(ValidationUtils.refreshTokenSchema), refresh);
router.post('/logout', validateRequest(ValidationUtils.refreshTokenSchema), logout);

router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', authRateLimiter, validateRequest(ValidationUtils.emailSchema), resendVerificationEmail);

router.post('/forgot-password', authRateLimiter, validateRequest(ValidationUtils.emailSchema), forgotPassword);
router.patch('/reset-password/:token', validateRequest(ValidationUtils.resetPasswordSchema), resetPassword);

export default router;
