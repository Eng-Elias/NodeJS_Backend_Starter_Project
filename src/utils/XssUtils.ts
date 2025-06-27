import xss from 'xss';

export class XssUtils {
  /**
   * Recursively sanitizes an object by cleaning all its string values.
   * @param value - The value to sanitize (can be any type).
   * @returns The sanitized value.
   */
  static escape<T>(value: T): T {
    if (typeof value === 'string') {
      return xss(value) as T;
    }

    if (Array.isArray(value)) {
      return value.map((item) => XssUtils.escape(item)) as T;
    }

    if (value !== null && typeof value === 'object') {
      const sanitizedObject: { [key: string]: any } = {};
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          sanitizedObject[key] = XssUtils.escape((value as any)[key]);
        }
      }
      return sanitizedObject as T;
    }

    return value;
  }
}
