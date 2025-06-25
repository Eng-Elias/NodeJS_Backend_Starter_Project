import swaggerJsdoc from 'swagger-jsdoc';
import { OpenAPIV3 } from 'openapi-types';


const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'NodeJS Backend Starter Project API',
    version: '1.0.0',
    description: 'API documentation for the NodeJS Backend Starter Project',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['fail', 'error'],
          },
          message: {
            type: 'string',
          },
        },
      },
      AuthTokens: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
          },
          refreshToken: {
            type: 'string',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          profile: {
            type: 'object',
            properties: {
              firstName: {
                type: 'string',
              },
              lastName: {
                type: 'string',
              },
            },
          },
          roles: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['user', 'admin'],
            },
          },
          isEmailVerified: {
            type: 'boolean',
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
}

const apiV1SwaggerOptions: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/v1/*.ts'],
};

const healthSwaggerOptions: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/health.ts'],
};

const healthSwaggerSpec = swaggerJsdoc(healthSwaggerOptions) as OpenAPIV3.Document;

const apiV1SwaggerSpec = swaggerJsdoc(apiV1SwaggerOptions) as OpenAPIV3.Document;

export { healthSwaggerSpec, apiV1SwaggerSpec };
