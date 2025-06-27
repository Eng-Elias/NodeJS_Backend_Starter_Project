# Routes

This document provides an overview of the API routes used in the application.

## `health.ts`

This file defines the health check endpoint for the service.

- **`GET /`**: Returns a `200 OK` response with a status of `healthy`. This is useful for monitoring the service's availability.

## `v1/`

This directory contains the version 1 API routes.

### `v1/index.ts`

This file serves as the main router for the v1 API. It consolidates all the v1 routes and exports a single router instance.

- **`/auth`**: All authentication-related routes are handled by `auth.routes.ts`.
- **`/users`**: All user-related routes are handled by `user.routes.ts`.

### `v1/auth.routes.ts`

This file defines all the routes related to user authentication and authorization. It includes Swagger annotations for API documentation.

- **`POST /register`**: Registers a new user.
- **`POST /login`**: Logs in a user.
- **`POST /refresh`**: Refreshes an access token.
- **`POST /logout`**: Logs out a user.
- **`GET /verify-email/:token`**: Verifies a user's email address.
- **`POST /resend-verification`**: Resends the email verification link.
- **`POST /forgot-password`**: Sends a password reset email.
- **`PATCH /reset-password/:token`**: Resets a user's password.

### `v1/user.routes.ts`

This file defines the routes for user management.

- **`GET /`**: Retrieves a paginated list of all users. This route is protected and can only be accessed by administrators. It also includes response caching to improve performance.
