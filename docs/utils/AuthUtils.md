# Auth Utils

`AuthUtils.ts` is a crucial utility class that centralizes all authentication-related logic, from password hashing to JSON Web Token (JWT) management. This keeps the authentication logic consistent and easy to manage.

## Features

- **Password Hashing**: Securely hashes and compares passwords using `bcrypt`.
- **JWT Generation**: Creates both access and refresh tokens with configurable expiration.
- **JWT Verification**: Validates JWTs using the appropriate secrets.
- **Secure Token Generation**: Generates random, secure tokens for email verification and password resets.

## Static Methods

### `hashPassword(password: string): Promise<string>`

Hashes a plain-text password using `bcrypt` with a salt of 10 rounds.

**Usage:**

```typescript
import { AuthUtils } from './AuthUtils';

const hashedPassword = await AuthUtils.hashPassword('my-secret-password');
```

### `comparePassword(password: string, hash: string): Promise<boolean>`

Compares a plain-text password against a stored hash to verify its correctness.

**Usage:**

```typescript
const isMatch = await AuthUtils.comparePassword(
  'user-provided-password',
  storedHash,
);
```

### `generateAccessToken(payload: object): string`

Generates a JWT access token. The payload is signed with the secret and expiration time defined in the application config.

**Usage:**

```typescript
const accessToken = AuthUtils.generateAccessToken({
  userId: '123',
  role: 'user',
});
```

### `generateRefreshToken(payload: object): string`

Generates a JWT refresh token, which typically has a longer expiration time than an access token.

**Usage:**

```typescript
const refreshToken = AuthUtils.generateRefreshToken({ userId: '123' });
```

### `verifyAccessToken(token: string): CustomJwtPayload | null`

Verifies an access token. It returns the decoded payload if the token is valid and not expired, otherwise it returns `null`.

**Usage:**

```typescript
const payload = AuthUtils.verifyAccessToken(tokenFromHeader);
if (payload) {
  // Token is valid
}
```

### `verifyRefreshToken(token: string): CustomJwtPayload | null`

Verifies a refresh token. It returns the decoded payload if the token is valid, otherwise `null`.

**Usage:**

```typescript
const payload = AuthUtils.verifyRefreshToken(refreshToken);
```

### `generateVerificationToken(): { token: string; hashedToken: string }`

Generates a secure, random token and its SHA256 hash. The plain token is typically sent to the user (e.g., in an email link), while the hash is stored in the database for verification. This prevents database theft from exposing the raw tokens.

**Usage:**

```typescript
const { token, hashedToken } = AuthUtils.generateVerificationToken();

// Send `token` to the user
// Save `hashedToken` to the database
```
