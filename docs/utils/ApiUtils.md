# API Utils

`ApiUtils.ts` provides a set of standardized status strings for API responses. This ensures consistency across the entire application when returning the status of a request.

## `API_STATUS`

A static object that contains predefined status strings:

- **`SUCCESS`**: Used when an API request is completed successfully.
- **`FAIL`**: Used for controlled failures, such as validation errors or when a resource is not found.
- **`ERROR`**: Used for unexpected server-side errors.

### Usage

This utility can be imported and used in controllers or services to structure the API response.

```typescript
import { ApiUtils } from './ApiUtils';

function someController(req, res) {
  try {
    // ... some logic
    res.status(200).json({ status: ApiUtils.API_STATUS.SUCCESS, data: { ... } });
  } catch (error) {
    if (error.isOperational) {
      res.status(error.statusCode).json({ status: ApiUtils.API_STATUS.FAIL, message: error.message });
    } else {
      res.status(500).json({ status: ApiUtils.API_STATUS.ERROR, message: 'An unexpected error occurred.' });
    }
  }
}
```
