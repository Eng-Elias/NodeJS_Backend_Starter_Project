import http from 'http';
import { app, memoryLogInterval, redisClient } from '@/app';
import config from '@/config';
import { Logger } from '@/utils/logger';
import { DatabaseUtils } from '@/utils/DatabaseUtils';
import { SocketUtils } from '@/utils/SocketUtils';
import { SchedulerUtils } from '@/utils/SchedulerUtils';
import { QueueUtils } from '@/utils/QueueUtils';
import { setupGraphQLServer } from '@/graphql/server';

async function startServer() {
  const httpServer = http.createServer(app);

  // Setup GraphQL Server before listening
  await setupGraphQLServer(app, httpServer);

  const server = httpServer.listen({ port: config.port }, () => {
    Logger.info(`Server is running on port ${config.port}`);
    Logger.info(
      `🚀 GraphQL server ready at http://localhost:${config.port}/graphql`,
    );
    SocketUtils.initialize(server);
    SchedulerUtils.startAllWorkers();
  });

  // Graceful shutdown
  const gracefulShutdown = (signal: string) => {
    process.on(signal, async () => {
      Logger.info(`${signal} received, shutting down gracefully...`);
      server.close(() => {
        Logger.info('HTTP server closed.');
      });

      await Promise.all([
        DatabaseUtils.disconnect().then(() =>
          Logger.info('MongoDB disconnected'),
        ),
        redisClient.quit().then(() => Logger.info('Redis disconnected')),
        QueueUtils.closeAll().then(() =>
          Logger.info('All Bull queues closed.'),
        ),
      ]);

      clearInterval(memoryLogInterval);

      process.exit(0);
    });
  };

  ['SIGINT', 'SIGTERM'].forEach((signal) => gracefulShutdown(signal));
}

startServer().catch((error) => {
  Logger.error('Failed to start server:', error);
  process.exit(1);
});
