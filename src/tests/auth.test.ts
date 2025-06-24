import request from 'supertest';
import express from 'express';
import v1Routes from '@/routes/v1';
import { User } from '@/models/user.model';
import { ApiUtils } from '@/utils/ApiUtils';

const app = express();
app.use(express.json());
app.use('/api/v1', v1Routes);

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

      console.log(res.statusCode, res.text);

      expect(res.statusCode).toBe(400);
      expect(res.text).toContain("An account with this email already exists.");
    });
  });
});
