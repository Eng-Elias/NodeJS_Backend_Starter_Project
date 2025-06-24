import express, { Express } from 'express';
import cors from 'cors';
import audit from 'express-requests-logger';
import { DatabaseUtils } from '@/utils/DatabaseUtils';
import { createClient } from 'redis';
import config from '@/config';
import healthRoutes from '@/routes/health';
import v1Routes from '@/routes/v1';
import { Logger } from '@/utils/logger';
import { globalErrorHandler } from '@/middleware/error.middleware';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '@/config/swagger';

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

const redisClient = createClient({ url: config.redisUri });

redisClient
  .connect()
  .then(() => Logger.info('Redis connected'))
  .catch((err: any) => Logger.error('Redis connection error:', err));

// Routes
app.use('/health', healthRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', v1Routes);

// Global error handler
app.use(globalErrorHandler);

// Start server
const server = app.listen(config.port, () => {
  Logger.info(`Server is running on port ${config.port}`);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  process.on(signal, async () => {
    Logger.info(`${signal} received, shutting down gracefully...`);
    server.close(() => {
      Logger.info('HTTP server closed.');
    });

    await Promise.all([
      DatabaseUtils.disconnect().then(() => Logger.info('MongoDB disconnected')),
      redisClient.quit().then(() => Logger.info('Redis disconnected')),
    ]);

    process.exit(0);
  });
};

['SIGINT', 'SIGTERM'].forEach((signal) => gracefulShutdown(signal));
