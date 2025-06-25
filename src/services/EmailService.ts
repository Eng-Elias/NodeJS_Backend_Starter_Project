import nodemailer from 'nodemailer';
import config from '@/config';
import { Logger } from '@/utils/logger';

/**
 * Service class for sending emails directly.
 * This should only be used by background workers.
 */
export class EmailService {
  private static transporter?: nodemailer.Transporter;

  private static initialize() {
    if (this.transporter) {
      return;
    }

    if (!config.email.host || !config.email.user || !config.email.pass) {
      Logger.warn('Email service not configured. Emails will not be sent.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  /**
   * Sends an email.
   * @param to - The recipient's email address.
   * @param subject - The subject of the email.
   * @param html - The HTML body of the email.
   */
  public static async sendEmail({ to, subject, html }: { to: string; subject: string; html: string }): Promise<void> {
    this.initialize();

    if (!this.transporter) {
      throw new Error('Email service is not configured.');
    }

    await this.transporter.sendMail({
      from: `\"${config.email.fromName}\" <${config.email.fromEmail}>`,
      to,
      subject,
      html,
    });
  }
}
