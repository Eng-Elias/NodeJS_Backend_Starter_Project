# NodeJS Backend Starter Project

This repository contains a robust and scalable starter project for building modern Node.js backend applications. It is built with TypeScript and comes pre-configured with a variety of tools and features to accelerate development, including authentication, background jobs, real-time events, and more.

For a deep dive into the project's architecture, modules, and utilities, please see the **[detailed documentation here](./docs/README.md)**.

## Features

- **TypeScript**: For type safety and improved developer experience.
- **Express.js**: A minimal and flexible Node.js web application framework.
- **MongoDB & Mongoose**: For database storage and object data modeling.
- **Redis**: Used for both caching and as a message broker for background jobs.
- **JWT Authentication**: Secure, token-based authentication with access and refresh tokens.
- **Background Jobs**: Uses `bull` for robust, Redis-based background job processing (e.g., for sending emails).
- **Real-Time Events**: `Socket.IO` for real-time, bidirectional communication with clients.
- **Comprehensive Validation**: `Joi` for request data validation.
- **Security**: Pre-configured with `helmet`, `cors`, XSS sanitization, and NoSQL injection prevention.
- **Structured Logging**: Centralized logging with `winston`.
- **API Documentation**: `swagger-jsdoc` and `swagger-ui-express` for generating and serving OpenAPI documentation.
- **Docker Support**: Includes a `Dockerfile` and `docker-compose.yml` for easy containerization.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (for running dependencies)

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/NodeJS_Backend_Starter_Project.git
    cd NodeJS_Backend_Starter_Project
    ```

2.  **Install dependencies:** for IDE auto import and completion

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project by copying the `.env.example` file. Then, fill in the required values.

    ```bash
    cp .env.example .env
    ```

4.  **Start the required services (MongoDB & Redis):**

    This project includes a `docker-compose.yml` file to easily spin up the necessary database and cache services.

    ```bash
    docker-compose up -d
    ```

    or using Makefile

    ```bash
    make up
    ```

### Running the Application

- **Development Mode:**

  This command starts the server with `ts-node-dev`, which automatically restarts the server on file changes.

  ```bash
  make dev
  ```

- **Production Mode:**

  This command first builds the TypeScript code into JavaScript in the `dist` directory and then starts the application.

  ```bash
  make up
  ```

### Running Tests

To run the test suite, use the following command:

```bash
make test
```

or specific test

```bash
make run-test file=<test_name>
```

e.g.

```bash
make run-test file=graphql
```

## Project Structure

```
NodeJS_Backend_Starter_Project/
├── CHANGELOG.md
├── Dockerfile
├── Makefile
├── README-GIT-HOOKS.md
├── README.md
├── commitlint.config.js
├── docker-compose.yml
├── docs
├── eslint.config.js
├── jest.config.js
├── migrate.ts
├── package-lock.json
├── package.json
├── src
│   ├── app.ts
│   ├── config
│   │   ├── index.ts
│   │   └── swagger.ts
│   ├── controllers
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── db
│   │   ├── migrations
│   │   │   └── template.ts
│   │   └── seed.ts
│   ├── graphql
│   │   ├── modules
│   │   │   ├── index.ts
│   │   │   └── user
│   │   │       ├── index.ts
│   │   │       ├── user.resolvers.ts
│   │   │       └── user.schema.ts
│   │   ├── resolvers.ts
│   │   ├── schema.ts
│   │   └── server.ts
│   ├── index.ts
│   ├── middleware
│   │   ├── auth.middleware.ts
│   │   ├── cache.middleware.ts
│   │   ├── db_injection_sanitize.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── rateLimiter.middleware.ts
│   │   ├── rbac.middleware.ts
│   │   ├── timeout.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── xss.middleware.ts
│   ├── models
│   │   ├── plugins
│   │   │   └── audit.plugin.ts
│   │   ├── swagger
│   │   └── user.model.ts
│   ├── routes
│   │   ├── health.ts
│   │   └── v1
│   │       ├── auth.routes.ts
│   │       ├── index.ts
│   │       └── user.routes.ts
│   ├── services
│   │   └── EmailService.ts
│   ├── templates
│   │   ├── emailVerification.template.html
│   │   └── passwordReset.template.html
│   ├── tests
│   │   ├── auth.test.ts
│   │   ├── graphql.test.ts
│   │   ├── integration
│   │   │   └── queues.test.ts
│   │   ├── realtime.test.ts
│   │   └── setup.ts
│   ├── types
│   │   ├── express.d.ts
│   │   └── user.types.ts
│   ├── utils
│   │   ├── ApiUtils.ts
│   │   ├── AppError.ts
│   │   ├── AuthUtils.ts
│   │   ├── CacheUtils.ts
│   │   ├── DatabaseUtils.ts
│   │   ├── DbInjectionSanitizeUtils.ts
│   │   ├── EmailUtils.ts
│   │   ├── EventUtils.ts
│   │   ├── PaginationUtils.ts
│   │   ├── PerformanceUtils.ts
│   │   ├── QueueUtils.ts
│   │   ├── SchedulerUtils.ts
│   │   ├── SocketUtils.ts
│   │   ├── StringUtils.ts
│   │   ├── TemplateUtils.ts
│   │   ├── ValidationUtils.ts
│   │   ├── XssUtils.ts
│   │   ├── catchAsync.ts
│   │   ├── logger.ts
│   │   └── swagger.ts
│   └── workers
│       ├── Processor.ts
│       ├── email.worker.ts
│       └── file_processing.worker.ts
├── tsconfig.json
```

## Further Documentation

For detailed information on each module, including how to use the various utilities and services, please refer to the **[documentation in the `docs` folder](./docs/README.md)**.
