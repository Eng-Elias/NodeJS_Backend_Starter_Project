import Bull from 'bull';
import config from '@/config';
import { Logger } from './logger';

export const QUEUE_NAMES = {
  EMAIL: 'email',
  FILE_PROCESSING: 'file_processing',
} as const;

type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

export class QueueUtils {
  private static queues: { [key in QueueName]?: Bull.Queue } = {};

  /**
   * Creates and returns a Bull queue instance.
   * It uses a singleton pattern to ensure only one instance per queue name is created.
   * @param queueName The name of the queue.
   * @returns A Bull.Queue instance.
   */
  public static getQueue({
    queueName,
    onError = () => {},
    onFailed = () => {},
    onCompleted = () => {},
  }: {
    queueName: QueueName;
    onError?: (error: any) => void;
    onFailed?: (job: any, err: any) => void;
    onCompleted?: (job: any) => void;
  }): Bull.Queue {
    if (!this.queues[queueName]) {
      const redisUrl = new URL(config.redis.uri);
      const redisConfig = {
        host: redisUrl.hostname,
        port: Number(redisUrl.port),
        password: redisUrl.password,
      };

      const queue = new Bull(queueName, {
        redis: redisConfig,
        defaultJobOptions: {
          attempts: 3, // Retry up to 3 times
          backoff: {
            type: 'exponential',
            delay: 1000, // 1s, 2s, 4s
          },
          removeOnComplete: true, // Remove job from Redis on completion
          removeOnFail: true, // Remove job from Redis on failure
        },
      });

      queue.on('error', (error) => {
        Logger.error(`Queue ${queueName} error:`, error);
        onError(error);
      });

      queue.on('failed', (job, err) => {
        Logger.error(`Job ${job.id} in queue ${queueName} failed:`, err);
        onFailed(job, err);
      });

      queue.on('completed', (job) => {
        Logger.info(
          `Job ${job.id} in queue ${queueName} completed successfully.`,
        );
        onCompleted(job);
      });

      this.queues[queueName] = queue;
      Logger.info(`Queue ${queueName} created and connected to Redis.`);
    }
    return this.queues[queueName] as Bull.Queue;
  }

  /**
   * Closes all registered Bull queues.
   */
  public static async closeAll(): Promise<void> {
    await Promise.all(
      Object.values(this.queues).map((queue) => queue?.close()),
    );
  }
}
