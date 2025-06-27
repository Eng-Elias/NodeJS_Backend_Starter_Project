# Cache Utils

`CacheUtils.ts` provides a streamlined interface for interacting with the Redis cache. It abstracts the complexities of the Redis client and provides simple, promise-based methods for common caching operations. It also includes error handling to prevent cache failures from crashing the application.

## Features

- **Simplified API**: Offers simple `get`, `set`, and `del` methods.
- **Pattern Deletion**: A `delByPattern` method for bulk cache invalidation.
- **Error Handling**: Gracefully logs errors without interrupting application flow.
- **JSON Serialization**: Automatically serializes objects to JSON strings before storing and deserializes them upon retrieval.

## Constants

- **`CACHE_PREFIX`**: A constant prefix (`cache:`) applied to cache keys for namespacing.
- **`CACHE_PATTERNS`**: An object containing predefined patterns for common cache groups, such as users.

## Static Methods

### `get<T>(key: string): Promise<T | null>`

Retrieves a value from the cache by its key. If the key does not exist or an error occurs, it returns `null`.

**Usage:**

```typescript
import { CacheUtils } from './CacheUtils';

interface UserData {
  id: string;
  name: string;
}

const userData = await CacheUtils.get<UserData>('cache:users:123');
if (userData) {
  // Use cached data
}
```

### `set<T>(key: string, value: T, ttlSeconds: number): Promise<void>`

Stores a value in the cache with a specified Time-To-Live (TTL) in seconds.

**Usage:**

```typescript
const user = { id: '123', name: 'John Doe' };
// Cache for 1 hour
await CacheUtils.set('cache:users:123', user, 3600);
```

### `del(key: string): Promise<void>`

Deletes a single key from the cache.

**Usage:**

```typescript
// Invalidate cache for a specific user
await CacheUtils.del('cache:users:123');
```

### `delByPattern(pattern: string): Promise<void>`

Deletes all keys matching a given glob-style pattern. This is extremely useful for invalidating groups of related cache entries at once.

**Usage:**

```typescript
import { CACHE_PATTERNS } from './CacheUtils';

// When a new user is created or users are updated,
// invalidate all cached user lists.
await CacheUtils.delByPattern(CACHE_PATTERNS.USERS);
```

### `clear(): Promise<void>`

Flushes the entire currently selected Redis database. This should be used with caution.

**Usage:**

```typescript
// For testing or a full cache reset
await CacheUtils.clear();
```
