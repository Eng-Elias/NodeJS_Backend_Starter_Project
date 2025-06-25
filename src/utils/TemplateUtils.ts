import fs from 'fs';
import path from 'path';
import { Logger } from './logger';

/**
 * A utility class for handling email templates.
 */
export class TemplateUtils {
  /**
   * Reads and renders an email template with the given data.
   *
   * @param templateName - The name of the template file (e.g., 'emailVerification').
   * @param data - An object containing data to be injected into the template.
   * @returns The rendered HTML string, or null if the template is not found.
   */
  public static renderTemplate(templateName: string, data: { [key: string]: string }): string | null {
    try {
      const templatePath = path.join(__dirname, `../templates/${templateName}.template.html`);
      let templateContent = fs.readFileSync(templatePath, 'utf-8');

      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const regex = new RegExp(`{{${key}}}`, 'g');
          templateContent = templateContent.replace(regex, data[key]);
        }
      }

      return templateContent;
    } catch (error) {
      Logger.error(`Error rendering template ${templateName}:`, error);
      return null;
    }
  }
}
