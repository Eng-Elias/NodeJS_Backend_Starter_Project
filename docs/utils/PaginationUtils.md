# Pagination Utils

`PaginationUtils.ts` provides a simple helper function to extract and calculate pagination parameters from an incoming HTTP request. This standardizes how pagination is handled for API endpoints that return lists of data, making it easy to implement consistent, paginated responses.

## `IPagination` Interface

The utility defines and returns an object that conforms to the `IPagination` interface:

```typescript
interface IPagination {
  limit: number; // The number of items per page
  skip: number; // The number of items to skip (for database queries)
  page: number; // The current page number
}
```

## Static Methods

### `getPagination(req: Request): IPagination`

This is the sole method of the utility. It inspects the `req.query` object for `page` and `limit` parameters.

- If `page` is not provided or is invalid, it defaults to `1`.
- If `limit` is not provided or is invalid, it defaults to `10`.
- It then calculates the `skip` value, which is essential for database queries (`(page - 1) * limit`).

**Usage:**

This function is typically called within a controller to get the necessary values for a database query.

```typescript
import { Request, Response } from 'express';
import { PaginationUtils } from './utils/PaginationUtils';
import { UserModel } from '../models';

async function getAllUsers(req: Request, res: Response) {
  // 1. Get pagination parameters from the request
  const { limit, skip, page } = PaginationUtils.getPagination(req);

  // 2. Use the parameters in the database query
  const users = await UserModel.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalUsers = await UserModel.countDocuments();

  // 3. Return the paginated data along with metadata
  res.status(200).json({
    status: 'success',
    data: {
      users,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
        totalItems: totalUsers,
      },
    },
  });
}
```

By calling `GET /api/v1/users?page=2&limit=20`, the `getPagination` function would return:

- `page`: 2
- `limit`: 20
- `skip`: 20
