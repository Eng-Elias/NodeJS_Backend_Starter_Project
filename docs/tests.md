# Tests

This document provides an overview of the testing setup and different types of tests in the application.

## `setup.ts`

This file configures the test environment before any tests are run. It uses `beforeAll`, `afterEach`, and `afterAll` hooks to manage the test database and cache state.

- **`beforeAll`**: Connects to a separate test database, drops it to ensure a clean state, and clears the cache.
- **`afterEach`**: Cleans up all data from the database collections after each test case.
- **`afterAll`**: Drops the test database, closes the database and Redis connections, and clears any intervals.

## `auth.test.ts`

This file contains integration tests for the authentication API endpoints.

- **`POST /api/v1/auth/register`**: Tests user registration, including success cases and handling of existing email addresses.
- **`POST /api/v1/auth/login`**: Tests user login with correct and incorrect credentials.
- **`POST /api/v1/auth/logout`**: Tests user logout and the invalidation of refresh tokens.

## `graphql.test.ts`

This file contains integration tests for the GraphQL API.

- **Authentication**: Tests user registration and login through GraphQL mutations.
- **Authenticated Queries**: Tests queries that require authentication, such as fetching the current user's profile (`me` query) and updating user information.
- **Error Handling**: Checks for appropriate error responses for unauthenticated requests and invalid inputs.

## `realtime.test.ts`

This file contains tests for the real-time features implemented with Socket.IO.

- **Socket.IO Authentication**: Tests the authentication middleware for Socket.IO connections, ensuring that only users with valid tokens can connect.

## `integration/queues.test.ts`

This file contains integration tests for the background job queues.

- **Email Queue**: Tests the email sending functionality by adding a job to the email queue and verifying that the `EmailService` is called with the correct parameters. It mocks the `EmailService` to prevent sending actual emails during tests.
