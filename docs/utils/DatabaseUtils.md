# Database Utils

`DatabaseUtils.ts` is a simple utility class responsible for managing the connection to the MongoDB database using `mongoose`. It provides static methods to connect and disconnect, centralizing the database connection logic.

## Features

- **Centralized Connection**: Manages the database connection in one place.
- **Graceful Handling**: Logs connection status and exits the process on a connection error, ensuring the application does not run without a database.
- **Configuration-Driven**: Uses the MongoDB connection URI from the application's configuration.

## Static Methods

### `connect(): Promise<void>`

Establishes a connection to the MongoDB database using the URI specified in `config.mongoUri`. It logs a success message upon connecting or logs an error and terminates the application if the connection fails.

**Usage:**

This method is typically called once when the application starts.

```typescript
import { DatabaseUtils } from './utils/DatabaseUtils';

async function startServer() {
  await DatabaseUtils.connect();
  // ... start the rest of the application
}

startServer();
```

### `disconnect(): Promise<void>`

Closes the active `mongoose` connection. This is useful for graceful shutdowns or for tearing down resources during integration tests.

**Usage:**

This method can be called when the application is shutting down.

```typescript
import { DatabaseUtils } from './utils/DatabaseUtils';

process.on('SIGINT', async () => {
  await DatabaseUtils.disconnect();
  process.exit(0);
});
```
