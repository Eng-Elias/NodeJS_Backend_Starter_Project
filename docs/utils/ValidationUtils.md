# Validation Utils

`ValidationUtils.ts` centralizes all data validation logic for the application using the powerful `Joi` library. By defining clear, reusable schemas, it ensures that data (like request bodies) conforms to the required format before it's processed by your services and controllers. This is a critical step for maintaining data integrity and providing clear feedback to API consumers.

## Features

- **Declarative Schemas**: Defines easy-to-read schemas for complex objects.
- **Type Coercion and Sanitization**: Joi automatically trims whitespace and lowercases emails as defined in the schemas.
- **Reusable Logic**: Schemas are exported and can be used in any part of the application, such as in middleware or directly in route handlers.
- **Customizable Error Messages**: The `validate` method aggregates all validation failures into a single, clear error message.

## Exported Schemas

The utility exports several pre-defined schemas for common operations:

- **`userCreateSchema`**: For validating the payload when a new user registers. It checks for `username`, `email`, `password`, `firstName`, and `lastName` with specific rules (e.g., password length, valid email format).
- **`userLoginSchema`**: For validating user login credentials (`email` and `password`).
- **`refreshTokenSchema`**: For validating the payload of a token refresh request, ensuring a `refreshToken` is provided.
- **`emailSchema`**: A simple schema for validating a single `email` field, used in operations like resending a verification email.
- **`resetPasswordSchema`**: For the password reset endpoint. It validates that `password` meets the minimum length and that `passwordConfirm` matches `password`.

## Static Methods

### `validate(schema: Joi.ObjectSchema, data: any)`

This is the core validation function. It takes a Joi schema and the data to be validated.

- If the data is valid, it returns the sanitized and validated data object.
- If the data is invalid, it throws an `Error` with a message that concatenates all the validation failures (e.g., `"Validation error: "password" is required, "email" must be a valid email"`).

**Usage:**

This method is typically used within a middleware or controller to validate incoming request data. It's best to wrap the call in a `try...catch` block to handle potential validation errors and return a `400 Bad Request` response.

```typescript
import { Request, Response } from 'express';
import { ValidationUtils } from './utils/ValidationUtils';
import { AppError } from './utils/AppError';

function createUser(req: Request, res: Response) {
  try {
    // 1. Validate the request body against the schema
    const validatedData = ValidationUtils.validate(
      ValidationUtils.userCreateSchema,
      req.body,
    );

    // 2. If validation succeeds, proceed with the validated data
    // const newUser = await UserService.createUser(validatedData);
    res.status(201).json({ status: 'success', data: validatedData });
  } catch (error) {
    // 3. If validation fails, throw an AppError
    throw new AppError({
      statusCode: 400,
      message: error.message,
    });
  }
}
```
