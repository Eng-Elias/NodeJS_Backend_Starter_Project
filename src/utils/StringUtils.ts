export class StringUtils {
  /**
   * Capitalizes the first letter of a string.
   * @param str The string to capitalize.
   * @returns The capitalized string.
   */
  public static capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Checks if a string is null, undefined, or empty.
   * @param str The string to check.
   * @returns True if the string is empty, false otherwise.
   */
  public static isEmpty(str: string | null | undefined): boolean {
    return str === null || str === undefined || str.trim() === '';
  }
}
