import mongoose from 'mongoose';
import { DatabaseUtils } from '@/utils/DatabaseUtils';

beforeAll(async () => {
  // Use a separate test database
  await DatabaseUtils.connect();
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
});
