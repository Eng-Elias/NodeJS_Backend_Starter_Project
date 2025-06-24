import dotenv from 'dotenv';
import { Logger } from '@/utils/logger';

dotenv.config();

const requiredEnvVars = ['PORT', 'MONGO_URI', 'NODE_ENV', 'REDIS_URI'];

/**
 * Validates that all required environment variables are set.
 */
const validateEnvVars = () => {
  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      Logger.error(`Environment variable ${varName} is not set.`);
      process.exit(1);
    }
  }
};

validateEnvVars();

const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI as string,
  nodeEnv: process.env.NODE_ENV || 'development',
  redisUri: process.env.REDIS_URI as string,
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN as string,
  },
};

export default config;
