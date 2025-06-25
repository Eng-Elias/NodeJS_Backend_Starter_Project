import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '@/config';
import { Logger } from './logger';
import { CustomJwtPayload } from '@/types/user.types';

// Extend the Socket interface to include our custom user property
interface AuthenticatedSocket extends Socket {
  user?: CustomJwtPayload;
}

export class SocketUtils {
  private static io: Server;

  /**
   * Initializes the Socket.IO server with authentication and event handlers.
   * @param httpServer The HTTP server instance to attach to.
   */
  public static initialize(httpServer: HttpServer): void {
    this.io = new Server(httpServer, {
      cors: {
        origin: config.corsOrigin,
        methods: ['GET', 'POST'],
      },
    });

    // Socket.IO Authentication Middleware
    this.io.use((socket: AuthenticatedSocket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: Token not provided.'));
      }

      try {
        const decoded = jwt.verify(token, config.jwt.secret) as CustomJwtPayload;
        socket.user = decoded;
        next();
      } catch (error) {
        Logger.error('Socket authentication failed:', error);
        return next(new Error('Authentication error: Invalid token.'));
      }
    });

    Logger.info('Socket.IO server initialized with authentication.');

    this.io.on('connection', (socket: AuthenticatedSocket) => {
      Logger.info(`Client connected: ${socket.id}, User ID: ${socket.user?.id}`);

      // Automatically join a room for user-specific notifications
      if (socket.user?.id) {
        this.joinRoom(socket, socket.user.id);
      }

      socket.on('disconnect', () => {
        Logger.info(`Client disconnected: ${socket.id}, User ID: ${socket.user?.id}`);
      });
    });
  }

  /**
   * Returns the Socket.IO server instance.
   * @returns The server instance.
   */
  public static getIO(): Server {
    if (!this.io) {
      throw new Error('Socket.IO not initialized.');
    }
    return this.io;
  }

  /**
   * Makes a socket join a specific room.
   * @param socket The socket instance.
   * @param room The name of the room to join.
   */
  public static joinRoom(socket: Socket, room: string): void {
    socket.join(room);
    Logger.info(`Socket ${socket.id} joined room ${room}`);
  }

  /**
   * Makes a socket leave a specific room.
   * @param socket The socket instance.
   * @param room The name of the room to leave.
   */
  public static leaveRoom(socket: Socket, room: string): void {
    socket.leave(room);
    Logger.info(`Socket ${socket.id} left room ${room}`);
  }
}
