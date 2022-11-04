import { DataSource } from 'typeorm';
import AppDataSource from '../../data-source';
import { request } from 'http';
import app from '../../app';

describe('/events', () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) =>
        console.log('Error during Data Source initialization', err)
      );
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test('GET /events/:eventId -> should be able to list all the information of an event', async () => {
    const event = await request(app).get('/events');
    const response = await request(app).get(`/events/${event.body[0].id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('date');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('address');
    expect(response.body).toHaveProperty('ong');
    expect(response.body).toHaveProperty('userEvents');
  });
});


