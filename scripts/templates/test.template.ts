import request from 'supertest';
import { app } from '@/app';
import { __MODULE_NAME__Model } from '@/models/__MODULE_NAME_LOWERCASE__.model';
import { ApiUtils } from '@/utils/ApiUtils';

describe('__MODULE_NAME__ Routes', () => {
  beforeEach(async () => {
    await __MODULE_NAME__Model.deleteMany({});
  });

  describe('POST /api/v1/__MODULE_NAME_LOWERCASE__s', () => {
    const requestData = {
      __TEST_POST_BODY__,
    };

    it('should create a new __MODULE_NAME_LOWERCASE__ and return 201', async () => {
      const res = await request(app)
        .post('/api/v1/__MODULE_NAME_LOWERCASE__s')
        .send(requestData);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe(ApiUtils.API_STATUS.SUCCESS);
      expect(res.body.data).toHaveProperty('id');
    });
  });

  describe('GET /api/v1/__MODULE_NAME_LOWERCASE__s', () => {
    beforeEach(async () => {
      // Seed the database for GET tests
      await __MODULE_NAME__Model.create([
        {
          __TEST_POST_BODY__,
        },
        {
          __TEST_POST_BODY_2__,
        },
      ]);
    });

    it('should return all __MODULE_NAME_LOWERCASE__s and return 200', async () => {
      const res = await request(app).get('/api/v1/__MODULE_NAME_LOWERCASE__s');

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(ApiUtils.API_STATUS.SUCCESS);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(2);
    });
  });
});
