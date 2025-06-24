import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '@/config';

/**
 * Utility class for cryptographic operations.
 */
export class CryptoUtils {
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
   * Generates a JWT token.
   * @param payload - The payload to sign.
   * @returns A JWT token.
   */
  public static generateToken(payload: object): string {
    // @ts-ignore
    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  }

  /**
   * Verifies a JWT token.
   * @param token - The token to verify.
   * @returns The decoded payload if the token is valid, otherwise null.
   */
  public static verifyToken(token: string): string | object | null {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      return null;
    }
  }
}
