import { Router } from 'express';
import { getAllUsers } from '@/controllers/user.controller';
import { protect } from '@/middleware/auth.middleware';
import { restrictTo } from '@/middleware/rbac.middleware';
import { UserRole } from '@/types/user.types';

const router = Router();

router.route('/').get(protect, restrictTo(UserRole.ADMIN), getAllUsers);

export default router;
