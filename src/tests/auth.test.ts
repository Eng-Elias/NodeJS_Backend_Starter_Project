import request from 'supertest';
import { app } from '@/app';
import v1Routes from '@/routes/v1';
import { User } from '@/models/user.model';
import { ApiUtils } from '@/utils/ApiUtils';

describe('Auth Routes', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/v1/auth/register', () => {
    const userRequestData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
    };

    it('should register a new user and return tokens', async () => {
      const res = await request(app).post('/api/v1/auth/register').send(userRequestData);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe(ApiUtils.API_STATUS.SUCCESS);
      expect(res.body.data.user.email).toBe(userRequestData.email);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('should return 400 if email is already taken', async () => {
      const userDbData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
        profile: {
          firstName: 'Test',
          lastName: 'User',
        },
      };
      await new User(userDbData).save();

      const res = await request(app).post('/api/v1/auth/register').send(userRequestData);

      expect(res.statusCode).toBe(400);
      expect(res.text).toContain("An account with this email already exists.");
    });
  });

  describe('POST /api/v1/auth/login', () => {
    const loginCredentials = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    beforeEach(async () => {
      // Create a user to test login
      const userDbData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
        profile: {
          firstName: 'Test',
          lastName: 'User',
        },
        isEmailVerified: true, // Assume email is verified for login tests
      };
      await new User(userDbData).save();
    });

    it('should login an existing user and return tokens', async () => {
      const res = await request(app).post('/api/v1/auth/login').send(loginCredentials);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(ApiUtils.API_STATUS.SUCCESS);
      expect(res.body.data.user.email).toBe(loginCredentials.email);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('should return 401 for incorrect password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ ...loginCredentials, password: 'WrongPassword!' });

      expect(res.statusCode).toBe(401);
      expect(res.text).toContain('Incorrect email or password');
    });

    it('should return 401 for non-existent email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ ...loginCredentials, email: 'wrong@example.com' });

      expect(res.statusCode).toBe(401);
      expect(res.text).toContain('Incorrect email or password');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    let refreshToken: string;

    beforeEach(async () => {
      // Create and login a user to get a refresh token
      const userDbData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
        profile: {
          firstName: 'Test',
          lastName: 'User',
        },
        isEmailVerified: true,
      };
      await new User(userDbData).save();

      const loginCredentials = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      const res = await request(app).post('/api/v1/auth/login').send(loginCredentials);
      refreshToken = res.body.refreshToken;
    });

    it('should logout the user and invalidate the refresh token', async () => {
      const res = await request(app).post('/api/v1/auth/logout').send({ refreshToken });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(ApiUtils.API_STATUS.SUCCESS);
      expect(res.body.message).toBe('Logged out successfully');

      // Verify the token is removed from the user's document
      const user = await User.findOne({ email: 'test@example.com' }).select('+refreshTokens');
      expect(user?.refreshTokens).not.toContain(refreshToken);
    });

    it('should return 400 if refresh token is missing', async () => {
      const res = await request(app).post('/api/v1/auth/logout').send({});
      console.log(res.body)
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('"refreshToken" is required');
    });

    it('should return 401 for an invalid refresh token', async () => {
      const res = await request(app).post('/api/v1/auth/logout').send({ refreshToken: 'invalidtoken' });
      expect(res.statusCode).toBe(401);
      expect(res.text).toContain('Invalid refresh token');
    });
  });
});
