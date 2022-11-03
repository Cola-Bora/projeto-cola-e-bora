import { DataSource } from "typeorm";
import AppDataSource from "../../data-source";
import app from "../../app"

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

  test("POST /events/:eventId -> register user in an event", async () => {
  });
});
