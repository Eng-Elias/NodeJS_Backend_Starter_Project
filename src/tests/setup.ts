import mongoose from 'mongoose';
import config from '@/config';

beforeAll(async () => {
  // Use a separate test database
  const mongoUri = `${config.mongoUri}-test`;
  await mongoose.connect(mongoUri);
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
