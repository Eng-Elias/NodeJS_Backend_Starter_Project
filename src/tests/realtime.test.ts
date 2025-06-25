import { Server } from 'http';
import { io, Socket } from 'socket.io-client';
import { app } from '@/app';
import { AuthUtils } from '@/utils/AuthUtils';
import { User } from '@/models/user.model';
import { IUser } from '@/types/user.types';
import { SocketUtils } from '@/utils/SocketUtils';

describe('Real-time Features', () => {
  let server: Server;
  let clientSocket: Socket;
  let port: number;

  beforeAll((done) => {
    server = app.listen(() => {
      const address = server.address();
      port = typeof address === 'string' ? parseInt(address.split(':').pop() || '0', 10) : address?.port || 0;
      if (!port) {
        throw new Error('Server port not found');
      }
      SocketUtils.initialize(server);
      done();
    });
  });

  afterAll((done) => {
    SocketUtils.getIO().close(done);
  });

  afterEach(() => {
    if (clientSocket && clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  describe('Socket.IO Authentication', () => {
    it('should not connect without a token', (done) => {
      clientSocket = io(`http://localhost:${port}`);
      clientSocket.on('connect_error', (err: Error) => {
        expect(err.message).toBe('Authentication error: Token not provided.');
        done();
      });
    });

    it('should not connect with an invalid token', (done) => {
      clientSocket = io(`http://localhost:${port}`, { auth: { token: 'invalidtoken' } });
      clientSocket.on('connect_error', (err: Error) => {
        expect(err.message).toBe('Authentication error: Invalid token.');
        done();
      });
    });

    it('should connect with a valid token', async () => {
      const user: IUser = await User.create({
        username: 'testuser_socket',
        email: 'test_socket@example.com',
        password: 'password123',
        profile: { firstName: 'Test', lastName: 'User' },
      });

      const accessToken = AuthUtils.generateAccessToken({ id: user._id.toString() });

      await new Promise<void>((resolve, reject) => {
        clientSocket = io(`http://localhost:${port}`, { auth: { token: accessToken } });
        clientSocket.on('connect', resolve);
        clientSocket.on('connect_error', reject);
      });

      expect(clientSocket.connected).toBe(true);
      await User.findByIdAndDelete(user._id);
    });
  });
});
