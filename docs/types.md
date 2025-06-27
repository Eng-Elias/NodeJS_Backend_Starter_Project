# Types

This document provides an overview of the custom TypeScript types and interfaces used throughout the application.

## `express.d.ts`

This file extends the global `Express` namespace to add a custom property to the `Request` object.

- **`Request.user`**: The `protect` middleware attaches the authenticated user object to the request. This declaration makes the `user` property available on the `Request` object, providing type safety and autocompletion in IDEs.

## `user.types.ts`

This file defines all the types and interfaces related to the `User` model.

- **`UserRole`**: An enum that defines the possible roles for a user (`ADMIN`, `USER`).
- **`IUserProfile`**: An interface for the user's profile information, including first name, last name, and an optional avatar URL.
- **`IUserPreferences`**: An interface for user-specific preferences, such as theme and notification settings.
- **`IUser`**: The main interface for the `User` document. It extends Mongoose's `SoftDeleteDocument` and includes all user-related fields, such as profile, preferences, roles, and authentication tokens.
- **`CustomJwtPayload`**: An interface that extends the default `jsonwebtoken` payload to include the user's `id`. This provides a typed structure for the data encoded in JWTs.
