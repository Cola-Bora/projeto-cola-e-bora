import request from 'supertest';
import { DataSource } from "typeorm";
import app from "../../app";
import AppDataSource from "../../data-source";
import { Categories } from "../../entities/ongCategory";
import createBaseCategoriesService from "../../services/categories/createBaseCategories.service";
import { mockedEvent, mockedOng, mockedUpdateEvent, mockedUser, mockedUserAdim, mockedUserAdimLogin, mockedUserLogin } from "../mocks/mock";

describe("/events", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) =>
        console.log("Error during Data Source initialization", err)
      );

      await request(app).post('/users').send(mockedUser);
      await request(app).post('/users').send(mockedUserAdim);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  let eventId : string

  test("POST /events -> create event", async () => {
    const adminLoginResponse = await request(app).post('/login').send(mockedUserAdimLogin);
    await createBaseCategoriesService();
    const categories = await request(app).get('/categories').set('Authorization', `Bearer ${adminLoginResponse.body.token}`);
    const newOng = await request(app).post('/ongs').set('Authorization', `Bearer ${adminLoginResponse.body.token}`).send(mockedOng(categories.body[0].id));
    const response = await request(app).post('/events/ongs').set('Authorization', `Bearer ${adminLoginResponse.body.token}`).send(mockedEvent(newOng.body.id));

    eventId = response.body.data.id
    expect(response.body).toHaveProperty('data');
    expect(response.status).toBe(201);
  });

  test("PATCH /events/:eventId -> update event", async () => {
    const adminLoginResponse = await request(app).post('/login').send(mockedUserAdimLogin);
    const events = await request(app).get('/events').set('Authorization', `Bearer ${adminLoginResponse.body.token}`);
    await request(app).patch(`/events/${events.body.data[0].id}`).set('Authorization', `Bearer ${adminLoginResponse.body.token}`).send(mockedUpdateEvent);

    const updatedEvent = await request(app).get(`/events/${events.body.data[0].id}`).set('Authorization', `Bearer ${adminLoginResponse.body.token}`);
    expect(updatedEvent.body.name).toBe('Event - updated');
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

  test("POST /events/:eventId -> register user in an event", async () => {
    const loginResponse = await request(app).post('/login').send(mockedUserLogin)
    const { token } = loginResponse.body

    const response = await request(app).post(`/events/${eventId}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({message: 'User successfully registered on event.'})
  })

  test("POST /events/:eventId -> The user can only register for an existing event", async () => {
    const loginResponse = await request(app).post('/login').send(mockedUserLogin)
    const { token } = loginResponse.body

    const wrongId = "bbe3df3f-6ba0-45e4-910c-0a2e8bfa0e7e"

    const response = await request(app).post(`/events/${wrongId}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404)
    expect(response.body).toMatchObject({message: 'Event not found'})
  })

  test("POST /events/:eventId -> ID must have a uuid format", async () => {
    const loginResponse = await request(app).post('/login').send(mockedUserLogin)
    const { token } = loginResponse.body

    const wrongId = "bbe3df3f-6ba0-45e4-910c-0a2e8bfa0e7"

    const response = await request(app).post(`/events/${wrongId}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({message: 'Id must have a valid UUID format'})
  })

  test("DELETE /events/:eventId -> Delete user from an event", async () => {
    const loginResponse = await request(app).post('/login').send(mockedUserLogin)
    const { token } = loginResponse.body

    const response = await request(app).delete(`/events/${eventId}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404)
    expect(response.body).toBeNull
  })

  test("DELETE /events/:eventId -> The user can only be deleted for an existing event", async () => {
    const loginResponse = await request(app).post('/login').send(mockedUserLogin)
    const { token } = loginResponse.body
    console.log("aqui")
    const wrongId = "bbe3df3f-6ba0-45e4-910c-0a2e8bfa2e7e"

    const response = await request(app).delete(`/events/${wrongId}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404)
    expect(response.body).toMatchObject({message: 'Event not found'})
  })

  test("DELETE /events/:eventId -> ID must have a uuid format", async () => {
    const loginResponse = await request(app).post('/login').send(mockedUserLogin)
    const { token } = loginResponse.body

    const wrongId = "bbe3df3f-6ba0-45e4-910c-0a2e8bfa0e7"

    const response = await request(app).delete(`/events/${wrongId}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({message: 'Id must have a valid UUID format'})
  })

  test("DELETE /events/:eventId -> delete event", async () => {
    const adminLoginResponse = await request(app).post('/login').send(mockedUserAdimLogin);
    const events = await request(app).get('/events').set('Authorization', `Bearer ${adminLoginResponse.body.token}`);
    await request(app).delete(`/events/${events.body.data[0].id}`).set('Authorization', `Bearer ${adminLoginResponse.body.token}`).send(mockedUpdateEvent);

    const deletedEvent = await request(app).get(`/events/${events.body.data[0].id}`).set('Authorization', `Bearer ${adminLoginResponse.body.token}`);
    console.log(deletedEvent.body);
    expect(deletedEvent.body.message).toBe('Event not found');
    expect(deletedEvent.status).toBe(404);
  });
});