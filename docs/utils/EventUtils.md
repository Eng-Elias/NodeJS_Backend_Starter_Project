# Event Utils

`EventUtils.ts` provides a centralized event bus for the application, implementing a publish-subscribe (pub/sub) pattern. This allows different parts of the system to communicate with each other without being directly coupled. It supports two main types of communication:

1.  **Internal Events**: For communication between different services or modules within the backend itself, using Node.js's native `EventEmitter`.
2.  **Real-Time Events**: For communication with connected clients via WebSockets, using `Socket.IO` through `SocketUtils`.

## Features

- **Decoupling**: Services can react to events without needing a direct reference to the service that triggered them.
- **Internal Bus**: A private `EventEmitter` instance for backend-only communication.
- **Real-Time Broadcasting**: Methods to easily send messages to all clients or specific rooms.
- **Centralized Logic**: A single place to manage all event emissions.

## Static Methods

### Internal Event Handling

These methods interact with the internal `EventEmitter`.

#### `emitInternal(eventName: string, data: any): void`

Emits an event that can only be heard by listeners within the backend.

**Usage:**

```typescript
// In a service after creating a new user
EventUtils.emitInternal('user:created', {
  userId: newUser.id,
  name: newUser.name,
});
```

#### `on(eventName: string, listener: (...args: any[]) => void): void`

Registers a listener for an internal event.

**Usage:**

```typescript
// In an analytics service
EventUtils.on('user:created', (data) => {
  console.log(`A new user was created: ${data.name}`);
  // ... log to analytics platform
});
```

#### `once(eventName: string, listener: (...args: any[]) => void): void`

Registers a one-time listener that is automatically removed after it is triggered once.

#### `off(eventName: string, listener: (...args: any[]) => void): void`

Removes a previously registered event listener.

### Real-Time Client Event Handling

These methods are used to send data to connected clients.

#### `emitBroadcast(eventName: string, data: any): void`

Sends a WebSocket event to every single connected client.

**Usage:**

```typescript
// When a system-wide announcement is made
EventUtils.emitBroadcast('announcement', {
  message: 'Server will restart in 5 minutes.',
});
```

#### `emitToRoom(room: string, eventName: string, data: any): void`

Sends a WebSocket event only to clients who have joined a specific room (e.g., a room for a specific user ID).

**Usage:**

```typescript
// Sending a private notification to a user
const userId = 'user-123';
EventUtils.emitToRoom(userId, 'notification:new', {
  message: 'Your report is ready.',
});
```
