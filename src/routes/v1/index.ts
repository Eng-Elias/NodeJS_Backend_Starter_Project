import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
// Import routes here

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
// Use routes here

export default router;
