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
import compression from 'compression';
import { customTimeout } from './middleware/timeout.middleware';
import { xssMiddleware } from './middleware/xss.middleware';
import { mongoSanitizeMiddleware } from './middleware/db_injection_sanitize.middleware';
import { DatabaseUtils } from './utils/DatabaseUtils';
import { PerformanceUtils } from '@/utils/PerformanceUtils';

const app: Express = express();

// Middleware
// Configure CORS
const corsOptions = {
  origin: config.corsOrigin,
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// XSS escape middleware
app.use(xssMiddleware);

// MongoDB injection sanitize middleware
app.use(mongoSanitizeMiddleware);

// Set request timeout
app.use(customTimeout(30000)); // 30 seconds
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

// Performance Monitoring
setInterval(() => {
  PerformanceUtils.logMemoryUsage();
}, 300000); // Every 5 minutes
Logger.info('Memory usage logging enabled.');

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
