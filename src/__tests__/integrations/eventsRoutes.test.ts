import { DataSource } from "typeorm";
import AppDataSource from "../../data-source";
import app from "../../app"
import { Categories } from "../../entities/ongCategory";
import { Ongs } from "../../entities/ong";
import { Addresses } from "../../entities/adress";
import { Events } from "../../entities/event";
import { mockedAddress, mockedEvent, mockedOng, mockedOngCategory } from "../mocks/mock";
import request from 'supertest';

describe("/events", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) =>
        console.log("Error during Data Source initialization", err)
      );
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /events -> create event", async () => {

    const categoryRepository = AppDataSource.getRepository(Categories);
    const ongRepository = AppDataSource.getRepository(Ongs);
    const addressRepository = AppDataSource.getRepository(Addresses);
    const eventRepository = AppDataSource.getRepository(Events);

    await categoryRepository.save(mockedOngCategory);
    await ongRepository.save(mockedOng);
    await addressRepository.save(mockedAddress);

    const response = await request(app).post('/events').set('Authorization', `Bearer`)
  });

  test("POST /events/:eventId -> register user in an event", async () => {
  });
});
