# Middleware

This document provides an overview of the middleware used in the application.

## `auth.middleware.ts`

- **`protect`**: This middleware protects routes by ensuring that the user is authenticated. It verifies the JWT from the `Authorization` header and attaches the user object to the request.

## `cache.middleware.ts`

- **`cache`**: This middleware caches responses for `GET` requests to improve performance. It uses Redis to store the cached data for a specified time-to-live (TTL).

## `db_injection_sanitize.middleware.ts`

- **`mongoSanitizeMiddleware`**: This middleware sanitizes the request body, query, and parameters to prevent NoSQL injection attacks by removing any keys that start with a `$` or contain a `.`.

## `error.middleware.ts`

- **`errorConverter`**: This middleware converts any non-`AppError` errors into an `AppError` instance, ensuring a consistent error format.
- **`globalErrorHandler`**: This is the global error handling middleware. It sends a structured error response to the client, distinguishing between operational and programming errors. In a production environment, it provides generic error messages for non-operational errors to avoid leaking implementation details.

## `rateLimiter.middleware.ts`

- **`authRateLimiter`**: This middleware limits the number of requests from a single IP address to prevent brute-force attacks on authentication routes.

## `rbac.middleware.ts`

- **`restrictTo`**: This middleware provides role-based access control (RBAC). It restricts access to certain routes based on the user's roles.

## `timeout.middleware.ts`

- **`customTimeout`**: This middleware sets a timeout for each request. If a request takes too long to process, it sends a `503 Service Unavailable` response.

## `validation.middleware.ts`

- **`validateRequest`**: This middleware validates the request body against a Joi schema. If the validation fails, it returns a `400 Bad Request` response with a detailed error message.

## `xss.middleware.ts`

- **`xssMiddleware`**: This middleware protects against Cross-Site Scripting (XSS) attacks by escaping potentially malicious characters in the request body, query, and parameters.
