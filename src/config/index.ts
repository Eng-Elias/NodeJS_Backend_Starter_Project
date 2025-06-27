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

interface IConfig {
  port: number;
  mongoUri: string;
  nodeEnv: string;
  redis: {
    uri: string;
  };
  corsOrigin: string;
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  email: {
    host?: string;
    port?: number;
    user?: string;
    pass?: string;
    fromName: string;
    fromEmail: string;
    verificationEnabled: boolean;
  };
}

const config: IConfig = {
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGO_URI as string,
  nodeEnv: process.env.NODE_ENV || 'development',
  redis: {
    uri: process.env.REDIS_URI as string,
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret:
      process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    fromName: process.env.EMAIL_FROM_NAME || 'Your App',
    fromEmail: process.env.EMAIL_FROM_EMAIL || 'noreply@yourapp.com',
    verificationEnabled: process.env.EMAIL_VERIFICATION_ENABLED === 'true',
  },
};

export default config;
