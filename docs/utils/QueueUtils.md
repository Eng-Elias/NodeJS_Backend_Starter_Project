# Queue Utils

`QueueUtils.ts` is a powerful utility for managing background job queues using the `bull` library, which is backed by Redis. It abstracts the setup and management of queues, providing a reliable way to offload long-running tasks (like sending emails or processing files) from the main application thread. This improves API response times and system resilience.

## Features

- **Singleton Pattern**: Ensures that only one instance of each queue is created, preventing duplicate connections and handlers.
- **Resilience and Retries**: Automatically configures jobs to be retried up to 3 times with an exponential backoff strategy if they fail.
- **Automatic Cleanup**: Configures jobs to be removed from Redis automatically upon completion or failure, keeping the queue clean.
- **Centralized Configuration**: Manages Redis connection details and queue options in one place.
- **Built-in Logging**: Automatically logs important queue events like errors, job failures, and job completions.
- **Graceful Shutdown**: Provides a method to close all active queue connections cleanly.

## `QUEUE_NAMES` Constant

A constant object that defines the names for all available queues in the application. This prevents typos and ensures consistency when referencing queues.

```typescript
export const QUEUE_NAMES = {
  EMAIL: 'email',
  FILE_PROCESSING: 'file_processing',
} as const;
```

## Static Methods

### `getQueue({ queueName, ...handlers }): Bull.Queue`

This is the primary method for accessing a queue. It retrieves an existing queue instance or creates a new one if it doesn't exist.

- **`queueName`**: The name of the queue to get, which must be one of the values from `QUEUE_NAMES`.
- **`onError`**, **`onFailed`**, **`onCompleted`** (optional): Callback functions that can be provided to handle queue-level events, in addition to the default logging.

**Usage:**

```typescript
import { QueueUtils, QUEUE_NAMES } from './utils/QueueUtils';

// 1. Get the email queue instance
const emailQueue = QueueUtils.getQueue({ queueName: QUEUE_NAMES.EMAIL });

// 2. Define the data for the job
const jobData = {
  to: 'test@example.com',
  subject: 'Welcome!',
  html: '<h1>Hello World</h1>',
};

// 3. Add the job to the queue
async function addEmailJob() {
  await emailQueue.add(jobData);
  console.log(
    `A new email job has been added to the '${QUEUE_NAMES.EMAIL}' queue.`,
  );
}
```

### `closeAll(): Promise<void>`

Closes all the Bull queue connections that have been opened. This is crucial for a graceful shutdown of the application, ensuring all connections to Redis are terminated properly.

**Usage:**

This should be called when the application is exiting.

```typescript
process.on('SIGINT', async () => {
  console.log('Application is shutting down...');
  await QueueUtils.closeAll();
  console.log('All queue connections have been closed.');
  process.exit(0);
});
```
