# Email Utils

`EmailUtils.ts` is responsible for dispatching email-related jobs to a background queue. Instead of sending emails directly, which can be a slow process and block the server's response, this utility adds the email task to a queue. A separate worker process then picks up this task and handles the actual sending.

This architectural pattern improves API response times and makes the system more resilient to email service failures.

## Features

- **Asynchronous Operations**: Decouples email sending from the main application flow.
- **Template-Based Content**: Uses `TemplateUtils` to generate the HTML body for emails, ensuring a consistent look and feel.
- **Queue Integration**: Leverages `QueueUtils` to add jobs to a dedicated email queue (`QUEUE_NAMES.EMAIL`).

## Static Methods

### `sendVerificationEmail(to: string, verificationLink: string): Promise<void>`

Creates and dispatches a job to send an email verification message. This is typically used right after a new user registers.

- **`to`**: The email address of the recipient.
- **`verificationLink`**: The unique URL the user must visit to verify their account.

**Usage:**

```typescript
import { EmailUtils } from './utils/EmailUtils';

// Inside a user registration service or controller
async function registerUser(email, password) {
  // ... create user logic ...

  const verificationToken = '...'; // Generate a unique token
  const verificationLink = `https://yourapp.com/verify-email?token=${verificationToken}`;

  // Add the email job to the queue
  await EmailUtils.sendVerificationEmail(email, verificationLink);

  // ... return response to user ...
}
```

### `sendPasswordResetEmail(to: string, resetLink: string): Promise<void>`

Creates and dispatches a job to send a password reset link to a user who has forgotten their password.

- **`to`**: The email address of the recipient.
- **`resetLink`**: The unique URL the user must visit to reset their password.

**Usage:**

```typescript
import { EmailUtils } from './utils/EmailUtils';

// Inside a "forgot password" service or controller
async function forgotPassword(email) {
  // ... logic to find user and generate reset token ...

  const resetToken = '...'; // Generate a unique token
  const resetLink = `https://yourapp.com/reset-password?token=${resetToken}`;

  // Add the email job to the queue
  await EmailUtils.sendPasswordResetEmail(email, resetLink);

  // ... return response to user ...
}
```
