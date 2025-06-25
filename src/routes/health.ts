import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check
 *     description: Returns the health status of the service.
 *     responses:
 *       200:
 *         description: Service is healthy.
 */
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy' });
});

export default router;
