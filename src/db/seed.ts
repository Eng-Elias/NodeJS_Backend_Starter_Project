import { DatabaseUtils } from '@/utils/DatabaseUtils';
import { User } from '@/models/user.model';
import { Logger } from '@/utils/logger';
import { UserRole } from '@/types/user.types';

const seedDatabase = async () => {
  try {
    await DatabaseUtils.connect();

    // Clear existing users
    await User.deleteMany({});
    Logger.info('Cleared existing users');

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123', // This will be hashed by the pre-save hook
      profile: {
        firstName: 'Admin',
        lastName: 'User',
      },
      roles: [UserRole.ADMIN, UserRole.USER],
    });

    await adminUser.save();
    Logger.info('Admin user created');

    await DatabaseUtils.disconnect();
  } catch (error: any) {
    Logger.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
