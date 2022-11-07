import request from 'supertest';
import { DataSource } from 'typeorm';
import app from '../../app';
import AppDataSource from '../../data-source';
import createBaseCategoriesService from '../../services/categories/createBaseCategories.service';
import {
  mockedEvent,
  mockedOng,
  mockedUpdateEvent,
  mockedUser,
  mockedUserAdim,
  mockedUserAdimLogin,
  mockedUserLogin,
} from '../mocks/mock';

describe('/events', () => {
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

  test('POST /events -> should be able to create event', async () => {
    const adminLoginResponse = await request(app)
      .post('/login')
      .send(mockedUserAdimLogin);
    await createBaseCategoriesService();
    const categories = await request(app)
      .get('/categories')
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`);
    const newOng = await request(app)
      .post('/ongs')
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedOng(categories.body[0].id));

    const response = await request(app)
      .post('/ongs/events')
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedEvent(newOng.body.data.id));

    expect(response.body).toHaveProperty('data');
    expect(response.status).toBe(201);
  });

  test('PATCH /events/:eventId -> should be able to update event', async () => {
    const adminLoginResponse = await request(app)
      .post('/login')
      .send(mockedUserAdimLogin);
    const events = await request(app).get('/events');
    await request(app)
      .patch(`/ongs/events/${events.body.data[0].id}`)
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedUpdateEvent);

    const updatedEvent = await request(app).get(
      `/events/${events.body.data[0].id}`
    );
    expect(updatedEvent.body.name).toBe('Event - updated');
  });

  test('PATCH /events/:eventId -> should not be able to update event when not found event id', async () => {
    const adminLoginResponse = await request(app)
      .post('/login')
      .send(mockedUserAdimLogin);
    const notExistingEventId = 'a908d8d1-344d-49b0-bff8-5e713cdd9af2';
    const response = await request(app)
      .patch(`/ongs/events/${notExistingEventId}`)
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedUpdateEvent);

    expect(response.body.message).toBe('Event not found');
    expect(response.statusCode).toBe(404);
  });

  test('GET /events/:eventId -> should be able to list all the information of an event', async () => {
    const event = await request(app).get('/events/');
    const response = await request(app).get(`/events/${event.body.data[0].id}`);
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

  test('GET /events/ongs/:ongId -> should be able to list all the events of an ONG', async () => {
    const ong = await request(app).get('/ongs');
    const response = await request(app).get(
      `/events/ongs/${ong.body.data[0].id}`
    );
    expect(response.status).toBe(200);
    expect(response.body.data[0]).toHaveProperty('id');
    expect(response.body.data[0]).toHaveProperty('name');
    expect(response.body.data[0]).toHaveProperty('date');
    expect(response.body.data[0]).toHaveProperty('description');
    expect(response.body.data[0]).toHaveProperty('address');
  });

  test('GET /events/ongs/:ongId - Should not be able to list properties of a event with invalid id', async () => {
    const response = await request(app).get(
      `/events/ongs/xxxx_invalid-uuid_xxxx`
    );
    expect(response.body).toHaveProperty('message');
    expect(response.status).toBe(400);
  });

  test('GET /events/ongs/:ongId - Should not be able to list properties of a not found ong', async () => {
    const response = await request(app).get(
      `/events/ongs/2ba81144-c78d-48f0-b8e9-9493d15ba9ad`
    );
    expect(response.body).toHaveProperty('message');
    expect(response.status).toBe(404);
  });

  test('GET /events -> Should be able to list all events', async () => {
    const response = await request(app).get('/events').send();

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toHaveProperty('id');
    expect(response.body.data[0]).toHaveProperty('name');
    expect(response.body.data[0]).toHaveProperty('date');
    expect(response.body.data[0]).toHaveProperty('description');
    expect(response.body.data[0]).toHaveProperty('ong');
    expect(response.body.data[0]).toHaveProperty('address');
    expect(response.status).toBe(200);
  });

  test('POST /events/:eventId -> register user in an event', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send(mockedUserLogin);
    const { token } = loginResponse.body;

    const event = await request(app).get('/events').send();
    const { id } = event.body.data[0];

    const response = await request(app)
      .post(`/events/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      message: 'User successfully registered on event.',
    });
  });

  test('POST /events/:eventId -> The user can only register for an existing event', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send(mockedUserLogin);
    const { token } = loginResponse.body;

    const wrongId = 'bbe3df3f-6ba0-45e4-910c-0a2e8bfa0e7e';

    const response = await request(app)
      .post(`/events/${wrongId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ message: 'Event not found' });
  });

  test('POST /events/:eventId -> ID must have a uuid format', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send(mockedUserLogin);
    const { token } = loginResponse.body;

    const wrongId = 'bbe3df3f-6ba0-45e4-910c-0a2e8bfa0e7';

    const response = await request(app)
      .post(`/events/${wrongId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      message: 'Id must have a valid UUID format',
    });
  });

  test('DELETE /events/:eventId -> Delete user from an event', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send(mockedUserLogin);
    const { token } = loginResponse.body;

    const event = await request(app).get('/events').send();
    const { id } = event.body.data[0];

    const response = await request(app)
      .delete(`/events/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
    expect(response.body).toBeNull;
  });

  test('DELETE /events/:eventId -> The user can only be deleted for an existing event', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send(mockedUserLogin);
    const { token } = loginResponse.body;
    const wrongId = 'bbe3df3f-6ba0-45e4-910c-0a2e8bfa2e7e';

    const response = await request(app)
      .delete(`/events/${wrongId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ message: 'Event not found' });
  });

  test('DELETE /events/:eventId -> ID must have a uuid format', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send(mockedUserLogin);
    const { token } = loginResponse.body;

    const wrongId = 'bbe3df3f-6ba0-45e4-910c-0a2e8bfa0e7';

    const response = await request(app)
      .delete(`/events/${wrongId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      message: 'Id must have a valid UUID format',
    });
  });

  test('DELETE /ongs/events/:eventId -> should be able to delete event', async () => {
    const adminLoginResponse = await request(app)
      .post('/login')
      .send(mockedUserAdimLogin);
    const events = await request(app).get('/events');
    const response = await request(app)
      .delete(`/ongs/events/${events.body.data[0].id}`)
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedUpdateEvent);

    const deletedEvent = await request(app)
      .get(`/events/${events.body.data[0].id}`)
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`);

    expect(response.status).toBe(204);
    expect(deletedEvent.body.message).toBe('Event not found');
  });

  test('DELETE /ongs/events/:eventId -> should not be able to delete event when not found event id', async () => {
    const adminLoginResponse = await request(app)
      .post('/login')
      .send(mockedUserAdimLogin);
    const notExistingEventId = 'a908d8d1-344d-49b0-bff8-5e713cdd9af2';
    const response = await request(app)
      .delete(`/ongs/events/${notExistingEventId}`)
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedUpdateEvent);

    expect(response.body.message).toBe('Event not found');
    expect(response.statusCode).toBe(404);
  });
});
