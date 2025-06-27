# Socket Utils

`SocketUtils.ts` is the central utility for managing real-time communication with clients using `Socket.IO`. It handles the initialization of the Socket.IO server, enforces authentication for all incoming connections, and provides helper methods for managing socket rooms.

## Features

- **Singleton Instance**: Manages a single, globally accessible `Socket.IO` server instance.
- **Authentication Middleware**: Includes a built-in middleware to protect your WebSocket connections. It requires clients to provide a valid JWT access token upon connection.
- **Automatic Room Joining**: Upon successful authentication, each client is automatically placed into a private room named after their user ID. This makes it easy to send targeted, user-specific notifications.
- **CORS Configuration**: Configures Cross-Origin Resource Sharing (CORS) based on the application's settings.
- **Graceful Error Handling**: Rejects connections that fail authentication with a clear error message.

## `AuthenticatedSocket` Interface

To make the authenticated user's data easily accessible, the utility extends the default `Socket` interface:

```typescript
interface AuthenticatedSocket extends Socket {
  user?: CustomJwtPayload; // The decoded JWT payload
}
```

## Static Methods

### `initialize(httpServer: HttpServer): void`

Attaches the `Socket.IO` server to the main HTTP server and sets up all the necessary middleware and event listeners. This method should be called once when the application starts.

**Usage:**

```typescript
import http from 'http';
import express from 'express';
import { SocketUtils } from './utils/SocketUtils';

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO and attach it to the server
SocketUtils.initialize(server);

server.listen(3000);
```

### `getIO(): Server`

Returns the singleton `Socket.IO` server instance. This is useful for other parts of the application (like `EventUtils`) that need to emit events to clients.

**Usage:**

```typescript
// In EventUtils.ts
const io = SocketUtils.getIO();
io.emit('some-event', { data: '...' });
```

### `joinRoom(socket: Socket, room: string): void`

A helper method to make a specific socket instance join a room.

**Usage:**

```typescript
// Inside the 'connection' event handler
socket.on('subscribe-to-channel', (channelId) => {
  SocketUtils.joinRoom(socket, `channel-${channelId}`);
});
```

### `leaveRoom(socket: Socket, room: string): void`

A helper method to make a specific socket instance leave a room.

**Usage:**

```typescript
socket.on('unsubscribe-from-channel', (channelId) => {
  SocketUtils.leaveRoom(socket, `channel-${channelId}`);
});
```
