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
  });

  test('GET /events/:eventId - Should not be able to list properties of a event with invalid id', async () => {
    const response = await request(app).get(`/events/xxxx_invalid-uuid_xxxx`);
    expect(response.body).toHaveProperty('message');
    expect(response.status).toBe(400);
  });

  test('GET /events/:eventId - Should not be able to list properties of a not found event', async () => {
    const response = await request(app).get(
      `/events/2ba81144-c78d-48f0-b8e9-9493d15ba9ad`
    );
    expect(response.body).toHaveProperty('message');
    expect(response.status).toBe(404);
  });

  test('GET /events/:ongId -> should be able to list all the events of an ONG', async () => {
    const ong = await request(app).get('/ongs');
    const response = await request(app).get(`/events/${ong.body[0].id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('date');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('address');
    expect(response.body).toHaveProperty('ong');
  });
});

test('GET /events/:ongId - Should not be able to list properties of a event with invalid id', async () => {
  const response = await request(app).get(`/events/xxxx_invalid-uuid_xxxx`);
  expect(response.body).toHaveProperty('message');
  expect(response.status).toBe(400);
});

test('GET /events/:ongId - Should not be able to list properties of a not found ong', async () => {
  const response = await request(app).get(
    `/ongs/2ba81144-c78d-48f0-b8e9-9493d15ba9ad`
  );
  expect(response.body).toHaveProperty('message');
  expect(response.status).toBe(404);
});
