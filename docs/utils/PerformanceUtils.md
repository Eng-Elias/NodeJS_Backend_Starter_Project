# Performance Utils

`PerformanceUtils.ts` is a simple utility for monitoring the application's performance, specifically its memory consumption. This can be very useful for debugging memory leaks or simply for keeping an eye on the application's resource footprint in different environments.

## Features

- **Detailed Memory Report**: Provides a formatted log of the key memory metrics from the Node.js process.
- **Easy Integration**: A single static method that can be called from anywhere in the application.

## Static Methods

### `logMemoryUsage(): void`

This method retrieves the current memory usage from `process.memoryUsage()` and logs a formatted string to the console using the application's `Logger`. The log includes:

- **RSS (Resident Set Size)**: The total memory allocated for the process in physical RAM.
- **HeapTotal**: The total size of the allocated heap.
- **HeapUsed**: The actual memory used by the application's objects.
- **External**: Memory used by C++ objects bound to JavaScript objects managed by V8.

All values are converted to megabytes (MB) for readability.

**Usage:**

This function can be called periodically using `setInterval` or at specific points in the code to diagnose performance issues.

```typescript
import { PerformanceUtils } from './utils/PerformanceUtils';
import express from 'express';

const app = express();

// Log memory usage every 30 seconds
setInterval(() => {
  PerformanceUtils.logMemoryUsage();
}, 30000);

// Or log it after a particularly memory-intensive operation
app.get('/process-large-file', (req, res) => {
  // ... code to process a large file ...
  PerformanceUtils.logMemoryUsage(); // See the impact of the operation
  res.send('File processed');
});
```
