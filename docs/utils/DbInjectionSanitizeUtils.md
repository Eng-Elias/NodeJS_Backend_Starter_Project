# DB Injection Sanitize Utils

`DbInjectionSanitizeUtils.ts` provides a critical security utility to prevent NoSQL injection attacks, specifically targeting MongoDB. Malicious actors can sometimes craft JSON payloads with keys like `$where` or `$ne` to manipulate database queries. This utility mitigates that risk by stripping out potentially harmful keys from input objects.

## Features

- **Recursive Sanitization**: The utility traverses nested objects and arrays to ensure all parts of the input are sanitized.
- **Key Filtering**: It removes any key that either starts with a `$` character or contains a `.` character, both of which have special meanings in MongoDB query objects.

## Static Methods

### `mongoSanitize<T>(value: T): T`

This is the core method of the utility. It takes any value and recursively sanitizes it. If the value is an object, it creates a new object containing only the safe keys. If it's an array, it sanitizes each element.

**Usage:**

This utility should be used as a middleware or directly in controllers to clean user-provided data before it is used in a database query, especially for query parameters like `req.query` or `req.body`.

```typescript
import { DbInjectionSanitizeUtils } from './DbInjectionSanitizeUtils';
import express from 'express';

const app = express();
app.use(express.json());

// Example of a middleware to sanitize the request body and query
app.use((req, res, next) => {
  req.body = DbInjectionSanitizeUtils.mongoSanitize(req.body);
  req.query = DbInjectionSanitizeUtils.mongoSanitize(req.query);
  next();
});

// Example of a malicious query object
const maliciousQuery = {
  username: 'someuser',
  $where: 'this.password.length > 0', // This could be used to probe for data
};

const sanitizedQuery = DbInjectionSanitizeUtils.mongoSanitize(maliciousQuery);

/*
`sanitizedQuery` will be:
{
  username: 'someuser'
}

The '$where' key has been removed.
*/

// Now it's safe to use sanitizedQuery in a database operation
// UserModel.find(sanitizedQuery);
```
