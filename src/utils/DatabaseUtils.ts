import mongoose from 'mongoose';
import config from '@/config';
import { Logger } from '@/utils/logger';

/**
 * Utility class for database operations.
 */
export class DatabaseUtils {
  /**
   * Connects to the MongoDB database.
   */
  public static async connect(): Promise<void> {
    try {
      await mongoose.connect(config.mongoUri);
      Logger.info('MongoDB connected successfully');
    } catch (error: any) {
      Logger.error('MongoDB connection error:', error.message);
      process.exit(1);
    }
  }

  /**
   * Disconnects from the MongoDB database.
   */
  public static async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      Logger.info('MongoDB disconnected successfully');
    } catch (error: any) {
      Logger.error('Error disconnecting from MongoDB:', error.message);
      process.exit(1);
    }
  }
}
