import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '@/config';

/**
 * Utility class for authentication-related operations.
 */
export class AuthUtils {
  /**
   * Hashes a password using bcrypt.
   * @param password - The password to hash.
   * @returns A promise that resolves to the hashed password.
   */
  public static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compares a password with a hash.
   * @param password - The plain text password.
   * @param hash - The hash to compare against.
   * @returns A promise that resolves to true if the password matches the hash, false otherwise.
   */
  public static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generates a JWT access token.
   * @param payload - The payload to sign.
   * @returns An access token.
   */
  public static generateAccessToken(payload: object): string {
    // @ts-ignore
    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  }

  /**
   * Generates a JWT refresh token.
   * @param payload - The payload to sign.
   * @returns A refresh token.
   */
  public static generateRefreshToken(payload: object): string {
    // @ts-ignore
    return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });
  }

  /**
   * Verifies a JWT token.
   * @param token - The token to verify.
   * @param isRefreshToken - Whether the token is a refresh token.
   * @returns The decoded payload if the token is valid, otherwise null.
   */
  public static verifyToken(token: string, isRefreshToken = false): string | object | null {
    try {
      const secret = isRefreshToken ? config.jwt.refreshSecret : config.jwt.secret;
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
  }

  /**
   * Generates a token for email verification or password reset.
   * @returns An object containing the plain token and the hashed token.
   */
  public static generateVerificationToken(): { token: string; hashedToken: string } {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    return { token, hashedToken };
  }
}
