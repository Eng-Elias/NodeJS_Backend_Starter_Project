# Controllers

This document provides an overview of the controller files, which handle the application's business logic.

## `auth.controller.ts`

This controller manages all authentication-related functionalities, including user registration, login, email verification, and password management.

### Key Functions

- **`register`**: Handles new user registration. It checks if a user with the given email already exists, creates a new user, and sends a verification email if the feature is enabled.
- **`login`**: Authenticates users by verifying their email and password. If successful, it generates and returns an access token and a refresh token.
- **`verifyEmail`**: Verifies a user's email address using a token sent to them. Upon successful verification, it issues new authentication tokens.
- **`refresh`**: Issues a new access token using a valid refresh token.
- **`logout`**: Logs a user out by invalidating their refresh token.
- **`resendVerificationEmail`**: Resends the email verification link to a user who has not yet verified their account.
- **`forgotPassword`**: Initiates the password reset process by sending a reset link to the user's email.
- **`resetPassword`**: Resets the user's password using a valid reset token.

### Error Handling

All controller functions are wrapped with `catchAsync` to handle any asynchronous errors and pass them to the global error handling middleware.

## `user.controller.ts`

This controller is responsible for handling user-related operations.

### Key Functions

- **`getAllUsers`**: Retrieves a paginated list of all users in the system. It uses `PaginationUtils` to handle pagination logic.

This controller demonstrates how to create a simple, paginated API endpoint for retrieving user data.
