# AppError

`AppError.ts` provides a custom error class that extends the built-in `Error` class. It is designed to create structured, "operational" errors that the application can anticipate and handle gracefully, distinguishing them from unexpected programming errors.

## Features

- **Custom Properties**: Adds `statusCode`, `status`, and `isOperational` properties to the standard `Error` object.
- **Automatic Status**: The `status` is automatically set to `fail` for 4xx status codes and `error` for all others.
- **Operational Flag**: The `isOperational` flag helps the global error handler decide whether to show a user-friendly message or a generic server error.

## `AppError` Class

The class constructor accepts an object with the following properties:

- **`message`** (string, required): The error message.
- **`statusCode`** (number, required): The HTTP status code associated with the error.
- **`isOperational`** (boolean, optional, default: `true`): A flag to indicate if this is a predictable, operational error.
- **`stack`** (string, optional): An optional stack trace. If not provided, it will be captured automatically.

### Usage

`AppError` should be used whenever you need to reject a request with a specific status code and message. This is common in services or controllers when input is invalid, a resource is not found, or a user is not authorized.

```typescript
import { AppError } from './AppError';
import { UserModel } from '../models';

async function getUserById(userId: string) {
  const user = await UserModel.findById(userId);

  if (!user) {
    // Throw a 404 Not Found error
    throw new AppError({
      message: 'User not found',
      statusCode: 404,
    });
  }

  return user;
}
```

This error can then be caught by a global error-handling middleware, which can inspect the `statusCode` and `isOperational` properties to send an appropriate HTTP response.
