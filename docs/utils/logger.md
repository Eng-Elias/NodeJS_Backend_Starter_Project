# Logger Utility

`logger.ts` provides a centralized, application-wide logging solution built on top of the popular `winston` library. A consistent logging utility is essential for debugging, monitoring application health, and auditing events in both development and production environments.

This utility abstracts the `winston` configuration into a simple static class, `Logger`, which can be easily imported and used anywhere in the application.

## Features

- **Powered by Winston**: Leverages a robust and highly configurable logging library.
- **Console Transport**: By default, it is configured to log all messages to the console.
- **Structured Logging**: It uses `winston.format.json()` as its base format, which is ideal for production environments where logs might be collected and parsed by services like Datadog or Splunk.
- **Developer-Friendly Output**: For console logging, it uses `winston.format.prettyPrint({ colorize: true })` to make the logs easy to read during development.
- **Standard Logging Levels**: Provides simple static methods for the most common log levels: `info`, `warn`, and `error`.

## Static Methods

The `Logger` class provides a wrapper around the `winston` instance, making it simple to call.

### `Logger.info(message: string, ...meta: any[])`

For informational messages, such as service startup, successful operations, or general application flow events.

**Usage:**

```typescript
import { Logger } from './utils/logger';

Logger.info('Server has started on port 3000.');
Logger.info('User successfully logged in.', { userId: '123' });
```

### `Logger.warn(message: string, ...meta: any[])`

For warnings about potential issues that do not prevent the application from functioning, such as deprecated API usage or non-critical configuration problems.

**Usage:**

```typescript
import { Logger } from './utils/logger';

Logger.warn('Redis connection is slow.', { responseTime: '300ms' });
```

### `Logger.error(message: string, ...meta: any[])`

For errors that have occurred. This should be used in `catch` blocks or when an operation fails.

**Usage:**

```typescript
import { Logger } from './utils/logger';

try {
  // some failing operation
} catch (error) {
  Logger.error('Failed to process user payment.', { userId: '123', error });
}
```
