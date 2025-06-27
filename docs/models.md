# Models

This document provides an overview of the data models used in the application.

## `user.model.ts`

This file defines the Mongoose schema for the `User` model. It includes all the fields related to a user's account, profile, and authentication.

### Schema Definition

- **`username`**: The user's unique username.
- **`email`**: The user's unique email address.
- **`password`**: The user's hashed password.
- **`profile`**: An object containing the user's first name, last name, and avatar URL.
- **`preferences`**: An object for storing user-specific settings, such as theme and notification preferences.
- **`roles`**: An array of roles assigned to the user (e.g., `user`, `admin`).
- **`isEmailVerified`**: A boolean flag indicating whether the user has verified their email address.
- **Authentication Tokens**: Fields for storing email verification, password reset, and refresh tokens.
- **`lastLogin`**: The timestamp of the user's last login.

### Plugins

- **`auditPlugin`**: Adds audit fields (`createdAt`, `updatedAt`, `createdBy`, `updatedBy`) to the schema.
- **`mongoose-delete`**: Implements soft-delete functionality, which marks documents as deleted instead of permanently removing them from the database.

### Hooks

- **`pre('save')`**: A pre-save hook that automatically hashes the user's password before saving it to the database if it has been modified.

## `plugins/audit.plugin.ts`

This file contains a reusable Mongoose plugin for adding audit trails to schemas.

### Features

- **Audit Fields**: Adds `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` to any schema it is applied to.
- **Timestamp Management**: Automatically sets the `createdAt` and `updatedAt` timestamps when a document is saved.
- **User Stamping (TODO)**: The plugin is set up to track which user created or updated a document, although the implementation for setting `createdBy` and `updatedBy` is noted as a TODO.
