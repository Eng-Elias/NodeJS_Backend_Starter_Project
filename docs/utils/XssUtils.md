# XSS Utils

`XssUtils.ts` provides a crucial security layer to protect the application from Cross-Site Scripting (XSS) attacks. XSS occurs when a malicious user injects scripts into data that is later displayed to other users. This utility prevents that by sanitizing all incoming string data, removing potentially harmful HTML and script tags.

## Features

- **Recursive Sanitization**: The utility is designed to deeply traverse any given object or array, ensuring that every nested string value is sanitized.
- **Powered by `xss`**: It leverages the popular and well-tested `xss` library to perform the sanitization, which is configured to strip out dangerous tags while allowing safe ones if needed (though the default configuration is quite strict).

## Static Methods

### `escape<T>(value: T): T`

This is the core sanitization function. It takes a value of any type and processes it as follows:

- If the value is a **string**, it passes it through the `xss()` function.
- If the value is an **array**, it recursively calls `escape` on each item in the array.
- If the value is an **object**, it recursively calls `escape` on each of its property values.
- If the value is any other type (e.g., `number`, `boolean`, `null`), it is returned unchanged.

**Usage:**

This utility should be used as a middleware to automatically clean the entire `req.body`, `req.query`, and `req.params` objects for every incoming request. This ensures that no unsanitized data ever reaches your application's business logic.

```typescript
import express from 'express';
import { XssUtils } from './utils/XssUtils';

const app = express();
app.use(express.json());

// Global XSS sanitization middleware
app.use((req, res, next) => {
  req.body = XssUtils.escape(req.body);
  req.query = XssUtils.escape(req.query);
  req.params = XssUtils.escape(req.params);
  next();
});

// Example of a malicious payload
const maliciousPayload = {
  comment: 'This is a great post! <script>alert("XSS Attack!")</script>',
  author: {
    name: 'Eve <img src=x onerror=alert(1)>',
    website: 'javascript:alert("bad site")',
  },
};

const sanitizedPayload = XssUtils.escape(maliciousPayload);

/*
`sanitizedPayload` will be:
{
  comment: 'This is a great post! &lt;script&gt;alert("XSS Attack!")&lt;/script&gt;',
  author: {
    name: 'Eve &lt;img src=x onerror=alert(1)&gt;',
    website: 'javascript:alert("bad site")'
  }
}

The harmful script tags and attributes have been neutralized.
*/
```
