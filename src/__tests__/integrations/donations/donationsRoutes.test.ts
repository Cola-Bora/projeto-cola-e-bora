import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import { mockedOng, mockedUser, mockedUserLogin } from "../../mocks/mock";
import createBaseCategoriesService from "../../../services/categories/createBaseCategories.service";

describe("/users", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then(res => (connection = res))
      .catch(err => console.log("Erro durante a inicialização", err));
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /donations/:ongId - Should not allow user donations with invalid token", async () => {
    await request(app).post("/users").send(mockedUser);

    const LoginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    const res = await request(app)
      .post(`/donations/${listUsers.body.data[0].id}`)
      .send({ value: 100 })
      .set("Authorization", `Bearer ${"invalid token"}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Invalid token");
    expect(res.status).toBe(401);
  });

  test("POST /donations/:ongId - Must create a donation", async () => {
    const LoginRes = await request(app).post("/login").send(mockedUserLogin);

    await createBaseCategoriesService();

    const ongCategory = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    const createOng = await request(app)
      .post("/ongs")
      .set("Authorization", `Bearer ${LoginRes.body.token}`)
      .send(mockedOng(ongCategory.body[0].id));

    const res = await request(app)
      .post(`/donations/${createOng.body.data.id}`)
      .send({ value: 100 })
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Successfully received donation");
    expect(res.status).toBe(201);
  });

  test("POST /donations/:ongId - Should not allow donation if the data type sent in the request body is different from number", async () => {
    const LoginRes = await request(app).post("/login").send(mockedUserLogin);

    const listOng = await request(app)
      .get("/ongs")
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    const res = await request(app)
      .post(`/donations/${listOng.body.data[0].id}`)
      .send({ value: "100" })
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Declared value is not of type number");
    expect(res.status).toBe(400);
  });

  test("POST /donations/:ongId - Should not make a donation if the user is inactive", async () => {
    const LoginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    await request(app)
      .delete(`/users/${listUsers.body.data[0].id}`)
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    const listOng = await request(app)
      .get("/ongs")
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    const res = await request(app)
      .post(`/donations/${listOng.body.data[0].id}`)
      .send({ value: 100 })
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("User inative");
    expect(res.status).toBe(400);
  });
});
