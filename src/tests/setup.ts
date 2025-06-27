import mongoose from 'mongoose';
import { DatabaseUtils } from '@/utils/DatabaseUtils';
import { redisClient, memoryLogInterval } from '../app';
import { CacheUtils } from '@/utils/CacheUtils';

beforeAll(async () => {
  // Use a separate test database
  await DatabaseUtils.connect();
  await mongoose.connection.dropDatabase();
  await CacheUtils.clear();
});

afterEach(async () => {
  // Clear all test data after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  // Drop the test database and disconnect
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await CacheUtils.clear();
  await redisClient.quit();
  clearInterval(memoryLogInterval);
});
