import nodemailer from 'nodemailer';
import config from '@/config';
import { Logger } from './logger';
import { TemplateUtils } from './TemplateUtils';

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

  /**
   * Sends a verification email to a new user.
   *
   * @param to - The recipient's email address.
   * @param verificationLink - The email verification link.
   */
  public static async sendVerificationEmail(to: string, verificationLink: string): Promise<void> {
    const subject = 'Verify Your Email Address';
    const htmlContent = TemplateUtils.renderTemplate('emailVerification', { verificationLink });

    if (!htmlContent) {
      Logger.error('Could not render email verification template.');
      return;
    }

    const textContent = `Welcome! Please verify your email by clicking this link: ${verificationLink}`;

    await this.sendEmail(to, subject, textContent, htmlContent);
  }

  /**
   * Sends a password reset email to a user.
   *
   * @param to - The recipient's email address.
   * @param resetLink - The password reset link.
   */
  public static async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    const subject = 'Password Reset Request';
    const htmlContent = TemplateUtils.renderTemplate('passwordReset', { resetLink });

    if (!htmlContent) {
      Logger.error('Could not render password reset template.');
      return;
    }

    const textContent = `You requested a password reset. Please click this link to reset your password: ${resetLink}`;

    await this.sendEmail(to, subject, textContent, htmlContent);
  }
}
