import { Job } from 'bull';
import { Logger } from '@/utils/logger';
import { Processor } from './Processor';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FileJobData {
  // Define file processing job data structure
  // e.g., filePath: string;
}

const fileProcessor = async (job: Job<FileJobData>): Promise<void> => {
  Logger.info(`Processing file job ${job.id}`);
  // Implement file processing logic here
  // e.g., read file, transform, save to cloud storage
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate work
  Logger.info(`File job ${job.id} completed.`);
};

export const fileProcessingWorker: Processor = {
  path: __filename,
  concurrency: 2, // Process up to 2 files concurrently
};

export default fileProcessor;
