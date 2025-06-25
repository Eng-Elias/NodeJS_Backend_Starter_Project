import express, { Express } from 'express';
import cors from 'cors';
import audit from 'express-requests-logger';
import { createClient } from 'redis';
import config from '@/config';
import healthRoutes from '@/routes/health';
import v1Routes from '@/routes/v1';
import { Logger } from '@/utils/logger';
import { globalErrorHandler, errorConverter } from '@/middleware/error.middleware';
import swaggerUi from 'swagger-ui-express';
import { healthSwaggerSpec, apiV1SwaggerSpec } from '@/config/swagger';
import { addSwaggerPathPrefix } from '@/utils/swagger';
import { DatabaseUtils } from './utils/DatabaseUtils';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  audit({
    logger: Logger.logger,
    request: {
      maskBody: ['password'],
      excludeHeaders: ['authorization'],
    },
    response: {
      maskBody: ['session_token'],
    },
  }),
);

// Database connections
DatabaseUtils.connect();

export const redisClient = createClient({ url: config.redisUri });

redisClient
  .connect()
  .then(() => Logger.info('Redis connected'))
  .catch((err: any) => Logger.error('Redis connection error:', err));

// Routes
app.use('/health', healthRoutes);
app.use('/api/v1', v1Routes);
// Swagger JSON specs
const prefixedApiV1Spec = addSwaggerPathPrefix(apiV1SwaggerSpec, '/api/v1');

app.get('/api-docs/v1.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(prefixedApiV1Spec);
});

const prefixedHealthSpec = addSwaggerPathPrefix(healthSwaggerSpec, '/health');


app.get('/api-docs/health.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(prefixedHealthSpec);
});

// Swagger UI
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    explorer: true,
    swaggerOptions: {
      urls: [
        {
          url: '/api-docs/v1.json',
          name: 'API v1',
        },
        {
          url: '/api-docs/health.json',
          name: 'Health',
        },
      ],
    },
  }),
);

// Error handling
app.use(errorConverter);
app.use(globalErrorHandler);

export { app };
