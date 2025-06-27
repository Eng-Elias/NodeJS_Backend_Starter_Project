# GraphQL

This document provides an overview of the GraphQL setup, including the server, schema, and resolvers.

## `server.ts`

This file is responsible for setting up the Apollo GraphQL server and integrating it with the Express application.

### Key Features

- **Apollo Server Integration**: Creates an instance of `ApolloServer` with the defined type definitions and resolvers.
- **Express Middleware**: Uses `expressMiddleware` to connect the Apollo Server to the Express app, making the GraphQL API available at the `/graphql` endpoint.
- **Context Creation**: Injects a `context` object into each GraphQL request. This context includes the authenticated user, which is determined by verifying the JWT from the `Authorization` header.
- **CORS Support**: Enables Cross-Origin Resource Sharing (CORS) for the GraphQL endpoint.

## `schema.ts` & `resolvers.ts`

These files serve as the entry points for the GraphQL schema and resolvers, respectively. They import the merged type definitions and resolvers from the `modules` directory.

## `modules/`

This directory contains the modularized GraphQL schema and resolvers. Each sub-directory represents a different GraphQL module (e.g., `user`).

### `modules/index.ts`

This file uses `@graphql-tools/merge` to combine the type definitions and resolvers from all the modules into a single schema and set of resolvers.

### `modules/user/`

This directory contains all the GraphQL components related to the `User` entity.

- **`user.schema.ts`**: Defines the GraphQL schema for the `User` type, including queries, mutations, and input types. It specifies the structure of the `User` object and the available operations.
- **`user.resolvers.ts`**: Implements the resolvers for the queries and mutations defined in the schema. It contains the business logic for fetching and manipulating user data.
- **`index.ts`**: Exports the `userModule`, which combines the `typeDefs` and `resolvers` for the user module.
