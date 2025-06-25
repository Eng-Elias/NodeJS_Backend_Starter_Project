import { Job } from 'bull';
import { EmailService } from '@/services/EmailService';
import { Logger } from '@/utils/logger';
import { Processor } from './Processor';

interface EmailJobData {
  to: string;
  subject: string;
  html: string;
}

const emailProcessor = async (job: Job<EmailJobData>): Promise<void> => {
  const { to, subject, html } = job.data;
  try {
    await EmailService.sendEmail({ to, subject, html });
    Logger.info(`Email sent to ${to} with subject "${subject}"`);
  } catch (error) {
    Logger.error(`Failed to send email to ${to}:`, error);
    throw error; // Important to throw error to trigger retry mechanism
  }
};

export const emailWorker: Processor = {
  path: __filename,
  concurrency: 5, // Process up to 5 emails concurrently
};

export default emailProcessor;
