# catchAsync Utility

`catchAsync.ts` provides a simple yet powerful higher-order function that eliminates the need for repetitive `try...catch` blocks in asynchronous Express.js route handlers. In Express, if an error occurs inside a `Promise` (like one returned from an `async` function), it must be explicitly passed to the `next()` function to be handled by the global error middleware. Forgetting to do this can lead to unhandled promise rejections that crash the Node.js process.

This utility wraps your async route handlers and automatically catches any rejected promises, passing the error along to `next()` for you.

## How It Works

`catchAsync` is a function that accepts another function (`fn`) as an argument. It returns a _new_ function that, when executed, calls the original `fn` and attaches a `.catch(next)` to its result. This ensures that any error thrown during the asynchronous operation is caught and forwarded to Express's error handling chain.

## Usage

To use it, simply wrap your asynchronous controller functions with `catchAsync` when you define your routes.

**Before `catchAsync`:**

```typescript
// You have to remember to write try...catch in every async controller
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await UserService.createUser(req.body);
    res.status(201).json({ status: 'success', data: newUser });
  } catch (error) {
    // If you forget this, the server might crash!
    next(error);
  }
};

router.post('/users', createUser);
```

**After `catchAsync`:**

```typescript
import { catchAsync } from './utils/catchAsync';

// The try...catch block is no longer needed!
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const newUser = await UserService.createUser(req.body);
  res.status(201).json({ status: 'success', data: newUser });
};

// Wrap the controller function when defining the route
router.post('/users', catchAsync(createUser));
```

By using `catchAsync`, your route handlers become cleaner, more readable, and less prone to errors from unhandled promise rejections.
