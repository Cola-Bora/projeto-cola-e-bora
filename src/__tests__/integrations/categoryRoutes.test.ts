import request from 'supertest';
import { DataSource } from 'typeorm';
import app from '../../app';
import AppDataSource from '../../data-source';
import { mockedUser, mockedUserAdim } from '../mocks/mock';

describe('/categories', () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) =>
        console.log('Error during Data Source initialization', err)
      );

    await request(app).post('/users').send(mockedUser);
    await request(app).post('/users').send(mockedUserAdim);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test('GET /categories -> should be able to list all the categories of an ong', async () => {
    const response = await request(app).get('/categories');
    expect(response.body).toHaveLength(1);
    expect(response.status).toBe(200);
  });
});
