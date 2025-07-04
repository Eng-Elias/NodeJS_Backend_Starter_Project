import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import config from '@/config';
import { CustomJwtPayload } from '@/types/user.types';

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
  public static async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generates a JWT access token.
   * @param payload - The payload to sign.
   * @returns An access token.
   */
  public static generateAccessToken(payload: object): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as SignOptions);
  }

  /**
   * Generates a JWT refresh token.
   * @param payload - The payload to sign.
   * @returns A refresh token.
   */
  public static generateRefreshToken(payload: object): string {
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    } as SignOptions);
  }

  /**
   * Verifies a JWT token.
   * @param token - The token to verify.
   * @param isRefreshToken - Whether the token is a refresh token.
   * @returns The decoded payload if the token is valid, otherwise null.
   */
  public static verifyToken(
    token: string,
    isRefreshToken = false,
  ): CustomJwtPayload | null {
    try {
      const secret = isRefreshToken
        ? config.jwt.refreshSecret
        : config.jwt.secret;
      return jwt.verify(token, secret) as CustomJwtPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verifies a JWT access token.
   * @param token - The access token to verify.
   * @returns The decoded payload if the token is valid, otherwise null.
   */
  public static verifyAccessToken(token: string): CustomJwtPayload | null {
    return this.verifyToken(token, false);
  }

  /**
   * Verifies a JWT refresh token.
   * @param token - The refresh token to verify.
   * @returns The decoded payload if the token is valid, otherwise null.
   */
  public static verifyRefreshToken(token: string): CustomJwtPayload | null {
    return this.verifyToken(token, true);
  }

  /**
   * Generates a token for email verification or password reset.
   * @returns An object containing the plain token and the hashed token.
   */
  public static generateVerificationToken(): {
    token: string;
    hashedToken: string;
  } {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    return { token, hashedToken };
  }
}
