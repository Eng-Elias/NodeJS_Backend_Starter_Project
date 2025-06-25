export class DbInjectionSanitizeUtils {

  /**
   * Recursively sanitizes an object to prevent NoSQL injection.
   * It removes keys that start with '$' or contain '.'.
   * @param value The object to sanitize.
   * @returns The sanitized object.
   */
  public static mongoSanitize<T>(value: T): T {
    if (value === null || typeof value !== 'object') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(item => DbInjectionSanitizeUtils.mongoSanitize(item)) as T;
    }

    const sanitizedObject: { [key: string]: any } = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        if (key.startsWith('$') || key.includes('.')) {
          // Skip potentially malicious keys
          continue;
        }
        sanitizedObject[key] = DbInjectionSanitizeUtils.mongoSanitize((value as any)[key]);
      }
    }

    return sanitizedObject as T;
  }
}
