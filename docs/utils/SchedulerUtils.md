# Scheduler Utils

`SchedulerUtils.ts` is the utility responsible for activating the background job workers. It bridges the gap between the message queues (managed by `QueueUtils`) and the actual worker functions that process the jobs. Its primary role is to initialize the consumers for each queue.

In a typical production setup, the code that runs the scheduler might be in a separate process from the main API server. The API server _adds_ jobs to the queue, and the worker process _consumes_ them. This utility provides the entry point for that worker process.

## Features

- **Centralized Worker Initialization**: Provides a single method to start all defined workers.
- **Dynamic Worker Attachment**: It retrieves queues and attaches the corresponding processor functions to them.
- **Concurrency Control**: It respects the concurrency settings defined in each worker's configuration.

## Static Methods

### `startAllWorkers(): void`

This is the core method of the utility. When called, it performs the following actions for each queue defined in `QUEUE_NAMES`:

1.  Gets the queue instance using `QueueUtils.getQueue()`.
2.  Imports the corresponding worker processor function (e.g., `emailProcessor` for the `email` queue).
3.  Calls the `.process()` method on the queue, passing the worker function and its configured concurrency level.
4.  Logs a message to confirm that the worker has started.

**Usage:**

This method should be called once when the application's worker process starts up.

```typescript
// In a dedicated worker entry file (e.g., worker.ts)

import { DatabaseUtils } from './utils/DatabaseUtils';
import { SchedulerUtils } from './utils/SchedulerUtils';
import { Logger } from './utils/logger';

async function startApp() {
  try {
    Logger.info('Worker process starting...');

    // Connect to the database if workers need it
    await DatabaseUtils.connect();

    // Start all job queue workers
    SchedulerUtils.startAllWorkers();

    Logger.info('Worker process started successfully.');
  } catch (error) {
    Logger.error('Failed to start worker process:', error);
    process.exit(1);
  }
}

startApp();
```
