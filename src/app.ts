import express, { Express } from 'express';
import cors from 'cors';
import audit from 'express-requests-logger';
import { createClient } from 'redis';
import config from '@/config';
import healthRoutes from '@/routes/health';
import v1Routes from '@/routes/v1';
import { Logger } from '@/utils/logger';
import { globalErrorHandler, errorConverter } from '@/middleware/error.middleware';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '@/config/swagger';
import { DatabaseUtils } from './utils/DatabaseUtils';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  audit({
    logger: Logger.logger,
    request: {
      maskBody: ['password'],
      excludeHeaders: ['authorization'],
    },
    response: {
      maskBody: ['session_token'],
    },
  }),
);

// Database connections
DatabaseUtils.connect();

export const redisClient = createClient({ url: config.redisUri });

redisClient
  .connect()
  .then(() => Logger.info('Redis connected'))
  .catch((err: any) => Logger.error('Redis connection error:', err));

// Routes
app.use('/health', healthRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', v1Routes);

// Error handling
app.use(errorConverter);
app.use(globalErrorHandler);

export { app };
