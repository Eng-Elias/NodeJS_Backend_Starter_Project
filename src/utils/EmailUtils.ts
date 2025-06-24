import nodemailer from 'nodemailer';
import config from '@/config';
import { Logger } from './logger';

/**
 * Utility class for sending emails.
 */
export class EmailUtils {
  private static transporter?: nodemailer.Transporter;

  private static initialize() {
    if (this.transporter) {
      return;
    }

    // Do not initialize transporter if email is not configured, to allow running the app without email credentials.
    if (!config.email.host || !config.email.user || !config.email.pass) {
      Logger.warn('Email service not configured. Emails will not be sent.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465, // true for 465, false for other ports
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
   * @param text - The plain text body of the email.
   * @param html - The HTML body of the email.
   */
  public static async sendEmail(to: string, subject: string, text: string, html: string): Promise<void> {
    this.initialize();

    if (!this.transporter) {
      Logger.error(`Email not sent to ${to} because email service is not configured.`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: `\"${config.email.fromName}\" <${config.email.fromEmail}>`,
        to,
        subject,
        text,
        html,
      });
      Logger.info(`Email sent to ${to}`);
    } catch (error: any) {
      Logger.error('Error sending email:', error.message);
    }
  }
}
