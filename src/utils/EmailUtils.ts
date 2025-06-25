import { TemplateUtils } from './TemplateUtils';
import { Logger } from './logger';
import { QueueUtils, QUEUE_NAMES } from './QueueUtils';

/**
 * Utility class for dispatching email jobs.
 */
export class EmailUtils {
  /**
   * Adds a verification email job to the queue.
   *
   * @param to - The recipient's email address.
   * @param verificationLink - The email verification link.
   */
  public static async sendVerificationEmail(to: string, verificationLink: string): Promise<void> {
    const subject = 'Verify Your Email Address';
    const html = TemplateUtils.renderTemplate('emailVerification', { verificationLink });

    if (!html) {
      Logger.error('Could not render email verification template.');
      return;
    }

    const emailQueue = QueueUtils.getQueue({
      queueName: QUEUE_NAMES.EMAIL
    });
    await emailQueue.add({ to, subject, html });
  }

  /**
   * Adds a password reset email job to the queue.
   *
   * @param to - The recipient's email address.
   * @param resetLink - The password reset link.
   */
  public static async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    const subject = 'Password Reset Request';
    const html = TemplateUtils.renderTemplate('passwordReset', { resetLink });

    if (!html) {
      Logger.error('Could not render password reset template.');
      return;
    }

    const emailQueue = QueueUtils.getQueue({
      queueName: QUEUE_NAMES.EMAIL
    });
    await emailQueue.add({ to, subject, html });
  }
}


