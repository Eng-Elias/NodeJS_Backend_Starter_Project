import { Router } from 'express';
import { register, login } from '@/controllers/auth.controller';
import { validateRequest } from '@/middleware/validation.middleware';
import { ValidationUtils } from '@/utils/ValidationUtils';
import { authRateLimiter } from '@/middleware/rateLimiter.middleware';

const router = Router();

router.post('/register', authRateLimiter, validateRequest(ValidationUtils.userCreateSchema), register);
router.post('/login', authRateLimiter, validateRequest(ValidationUtils.userLoginSchema), login);

export default router;
