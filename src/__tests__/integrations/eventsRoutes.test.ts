import request from 'supertest';
import { DataSource } from "typeorm";
import app from "../../app";
import AppDataSource from "../../data-source";
import { Categories } from "../../entities/ongCategory";
import createBaseCategoriesService from "../../services/category/createBaseCategories.service";
import { mockedEvent, mockedOng, mockedUser, mockedUserAdim, mockedUserAdimLogin } from "../mocks/mock";

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

  test("POST /events -> create event", async () => {
    const adminLoginResponse = await request(app).post('/login').send(mockedUserAdimLogin);
    console.log(adminLoginResponse.body);
    await createBaseCategoriesService();
    const newCategories = await AppDataSource.getRepository(Categories).find();
    const newOng = await request(app).post('/ongs').set('Authorization', `Bearer ${adminLoginResponse.body.token}`).send(mockedOng(newCategories[0].id));
    const response = await request(app).post('/events').set('Authorization', `Bearer ${adminLoginResponse.body.token}`).send(mockedEvent(newOng.body.id));

    expect(response.body).toHaveProperty('data');
    expect(response.status).toBe(201);
  });

  test("POST /events/:eventId -> register user in an event", async () => {
  });
});
