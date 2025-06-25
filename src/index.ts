import { app, redisClient } from '@/app';
import config from '@/config';
import { Logger } from '@/utils/logger';
import { DatabaseUtils } from '@/utils/DatabaseUtils';

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
