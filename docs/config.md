# Configuration

This document provides an overview of the configuration files used in the NodeJS Backend Starter Project.

## `index.ts`

This file is responsible for managing the application's configuration by reading environment variables. It ensures that all required variables are set before the application starts, preventing runtime errors due to missing configuration.

### Key Features

- **Environment Variable Loading**: Uses `dotenv` to load environment variables from a `.env` file.
- **Validation**: Checks for the presence of essential environment variables like `PORT`, `MONGO_URI`, `NODE_ENV`, and `REDIS_URI`. If any of these are missing, the application will exit with an error.
- **Typed Configuration**: Defines an `IConfig` interface to provide type safety for the configuration object.
- **Default Values**: Provides default values for non-essential variables to ensure the application can run in a development environment without a full setup.

### Configuration Object

The `config` object contains the following properties:

- `port`: The port on which the server will run.
- `mongoUri`: The connection string for the MongoDB database.
- `nodeEnv`: The application's environment (e.g., `development`, `production`).
- `redis.uri`: The connection string for the Redis server.
- `corsOrigin`: The allowed origin for Cross-Origin Resource Sharing (CORS).
- `jwt`: Contains JWT-related settings:
  - `secret`: The secret key for signing JWTs.
  - `expiresIn`: The expiration time for access tokens.
  - `refreshSecret`: The secret key for signing refresh tokens.
  - `refreshExpiresIn`: The expiration time for refresh tokens.
- `email`: Contains email service settings:
  - `host`, `port`, `user`, `pass`: SMTP server credentials.
  - `fromName`, `fromEmail`: The sender's name and email address.
  - `verificationEnabled`: A flag to enable or disable email verification.

## `swagger.ts`

This file sets up Swagger for generating API documentation. It uses `swagger-jsdoc` to create OpenAPI 3.0 specifications from JSDoc comments in the route files.

### Key Features

- **Swagger Definition**: Defines the basic OpenAPI structure, including the title, version, and description of the API.
- **Security Schemes**: Configures JWT-based authentication (`bearerAuth`) for securing API endpoints.
- **Reusable Schemas**: Defines reusable schemas for common data structures like `Error`, `AuthTokens`, and `User`.
- **Multiple Specifications**: Generates separate Swagger specifications for different parts of the API:
  - `apiV1SwaggerSpec`: For the main v1 API routes.
  - `healthSwaggerSpec`: For the health check endpoint.

This setup allows for clear and organized API documentation, making it easier for developers to understand and interact with the API.
