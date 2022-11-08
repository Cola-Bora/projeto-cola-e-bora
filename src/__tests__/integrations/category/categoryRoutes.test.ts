import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import AppDataSource from "../../../data-source";
import { mockedUser, mockedUserAdim, mockedUserLogin } from "../../mocks/mock";
import createBaseCategoriesService from "../../../services/categories/createBaseCategories.service";

describe("/categories", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) =>
        console.log("Error during Data Source initialization", err)
      );

    await request(app).post("/users").send(mockedUser);
    await request(app).post("/users").send(mockedUserAdim);
  });
  afterAll(async () => {
    await connection.destroy();
  });

  test("GET /categories -> should be able to list all the categories of an ong", async () => {
    const user = await request(app).post("/login").send(mockedUserLogin);
    await createBaseCategoriesService();
    const response = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${user.body.token}`);
    expect(response.body).toHaveLength(9);
    expect(response.status).toBe(200);
  });
});
