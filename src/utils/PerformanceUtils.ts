import { Logger } from '@/utils/logger';

/**
 * Utility class for performance monitoring.
 */
export class PerformanceUtils {
  /**
   * Logs the current memory usage of the Node.js process.
   */
  static logMemoryUsage(): void {
    const usage = process.memoryUsage();
    const message = `Memory Usage: RSS=${(usage.rss / 1024 / 1024).toFixed(2)} MB, HeapTotal=${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB, HeapUsed=${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB, External=${(usage.external / 1024 / 1024).toFixed(2)} MB`;
    Logger.info(message);
  }
}
