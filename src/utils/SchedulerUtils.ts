import { QueueUtils, QUEUE_NAMES } from './QueueUtils';
import { Logger } from './logger';
import emailProcessor, { emailWorker } from '@/workers/email.worker';
import fileProcessor, {
  fileProcessingWorker,
} from '@/workers/file_processing.worker';

/**
 * Utility class for scheduling and managing background jobs.
 */
export class SchedulerUtils {
  /**
   * Initializes and starts all job processors.
   */
  public static startAllWorkers(): void {
    Logger.info('Starting all workers...');

    const emailQueue = QueueUtils.getQueue({
      queueName: QUEUE_NAMES.EMAIL,
    });
    emailQueue.process(emailWorker.concurrency, emailProcessor);
    Logger.info(
      `Worker for queue "${QUEUE_NAMES.EMAIL}" started with concurrency ${emailWorker.concurrency}.`,
    );

    const fileQueue = QueueUtils.getQueue({
      queueName: QUEUE_NAMES.FILE_PROCESSING,
    });
    fileQueue.process(fileProcessingWorker.concurrency, fileProcessor);
    Logger.info(
      `Worker for queue "${QUEUE_NAMES.FILE_PROCESSING}" started with concurrency ${fileProcessingWorker.concurrency}.`,
    );
  }
}
