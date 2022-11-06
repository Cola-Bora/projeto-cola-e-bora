import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import {
  mockedInvalidKeyPayment,
  mockedInvalidRequestBodyPayment,
  mockedPayment,
} from "../../mocks/payments/paymentsMocks";
import { mockedUser, mockedUserLogin } from "../../mocks/users/usersMocks";

describe("/users/payments", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then(res => (connection = res))
      .catch(err => console.log("Erro durante a inicialização", err));
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /users/payments/:id - Não deve criar método de pagamento se o tamanho do corpo da requisição for diferente de 3", async () => {
    await request(app).post("/users").send(mockedUser);

    const loginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    const res = await request(app)
      .post(`/users/payments/${listUsers.body.data[0].id}`)
      .send(mockedInvalidRequestBodyPayment)
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Required field is missing");
    expect(res.status).toBe(400);
  });

  test("POST /users/payments/:id - Não deve criar método de pagamento caso contenha alguma chave errada no corpo da requisição", async () => {
    const loginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    const res = await request(app)
      .post(`/users/payments/${listUsers.body.data[0].id}`)
      .send(mockedInvalidKeyPayment)
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Invalid key");
    expect(res.status).toBe(400);
  });

  test("POST /users/payments/:id - Não deve criar método de pagamento utilizando id de outro usuário ou inexistente", async () => {
    const loginRes = await request(app).post("/login").send(mockedUserLogin);

    const res = await request(app)
      .post(`/users/payments/94e8d84f-f2e3-4811-975b-220dfae0186a`)
      .send(mockedPayment)
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Unauthorized");
    expect(res.status).toBe(401);
  });

  test("POST /users/payments/:id - Não deve criar método de pagamento caso token seja inválido", async () => {
    const loginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    const res = await request(app)
      .post(`/users/payments/${listUsers.body.data[0].id}`)
      .send(mockedPayment)
      .set("Authorization", `Bearer invalidToken`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Invalid token");
    expect(res.status).toBe(401);
  });

  test("POST /users/payments/:id - Deve criar método de pagamento", async () => {
    const loginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    const res = await request(app)
      .post(`/users/payments/${listUsers.body.data[0].id}`)
      .send(mockedPayment)
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Credit card successfully created");
    expect(res.status).toBe(201);
  });

  test("POST /users/payments/:id - Não deve criar método de pagamento caso exista algum registrado", async () => {
    const loginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    const res = await request(app)
      .post(`/users/payments/${listUsers.body.data[0].id}`)
      .send(mockedPayment)
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(
      "User already has a credit card registered"
    );
    expect(res.status).toBe(404);
  });

  test("PATCH /users/payments/:id - Não deve atualizar método de pagamento caso contenha alguma chave errada no corpo da requisição", async () => {
    const loginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    const res = await request(app)
      .patch(`/users/payments/${listUsers.body.data[0].id}`)
      .send(mockedInvalidKeyPayment)
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Invalid key");
    expect(res.status).toBe(400);
  });

  test("PATCH /users/payments/:id - Não deve atualizar método de pagamento caso token seja inválido", async () => {
    const loginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    const res = await request(app)
      .patch(`/users/payments/${listUsers.body.data[0].id}`)
      .send(mockedPayment)
      .set("Authorization", `Bearer ${"invalidTooken"}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Invalid token");
    expect(res.status).toBe(401);
  });

  test("PATCH /users/payments/:id - Não deve atualizar método de pagamento utilizando id de outro usuário ou inexistente", async () => {
    const loginRes = await request(app).post("/login").send(mockedUserLogin);

    const res = await request(app)
      .patch(`/users/payments/94e8d84f-f2e3-4811-975b-220dfae0186a`)
      .send(mockedPayment)
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Unauthorized");
    expect(res.status).toBe(401);
  });

  test("PATCH /users/payments/:id - Deeve atualizar método de pagamento", async () => {
    const loginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    const res = await request(app)
      .patch(`/users/payments/${listUsers.body.data[0].id}`)
      .send({ number: "5593889718264344" })
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Payment method successfully edited");
    expect(res.status).toBe(200);
  });

  test("DELETE /users/payments/:id - Não deve deletar método de pagamento caso token seja inválido", async () => {
    const loginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    const res = await request(app)
      .delete(`/users/payments/${listUsers.body.data[0].id}`)
      .set("Authorization", `Bearer ${"invalidTooken"}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Invalid token");
    expect(res.status).toBe(401);
  });

  test("DELETE /users/payments/:id - Não deve deletar método de pagamento utilizando id de outro usuário ou inexistente", async () => {
    const loginRes = await request(app).post("/login").send(mockedUserLogin);

    const res = await request(app)
      .delete(`/users/payments/94e8d84f-f2e3-4811-975b-220dfae0186a`)
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Unauthorized");
    expect(res.status).toBe(401);
  });

  test("DELETE /users/payments/:id - Deve deletar método de pagamento", async () => {
    const loginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    const res = await request(app)
      .delete(`/users/payments/${listUsers.body.data[0].id}`)
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.status).toBe(204);
  });

  test("PATCH /user/payments/:id - Não deve atualizar método de pagamento do usuário inativo", async () => {
    const LoginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    await request(app)
      .delete(`/users/${listUsers.body.data[0].id}`)
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    const listDeletedUser = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    const res = await request(app)
      .patch(`/users/payments/${listDeletedUser.body.data[0].id}`)
      .send({ number: "5593889718264344" })
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("User inative");
    expect(res.status).toBe(400);
  });

  test("DELETE /user/payments/:id - Não deve deletar método de pagamento do usuário inativo", async () => {
    const LoginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    await request(app)
      .delete(`/users/${listUsers.body.data[0].id}`)
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    const listDeletedUser = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    const res = await request(app)
      .delete(`/users/payments/${listDeletedUser.body.data[0].id}`)
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("User inative");
    expect(res.status).toBe(400);
  });

  test("DELETE /users/payments/:id - Não deve deletar método de pagamento inexistente", async () => {
    const loginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    const res = await request(app)
      .delete(`/users/payments/${listUsers.body.data[0].id}`)
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Payment method does not exist");
    expect(res.status).toBe(404);
  });

  test("PATCH /users/payments/:id - Não deve atualizar método de pagamento inexistente", async () => {
    const loginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    const res = await request(app)
      .patch(`/users/payments/${listUsers.body.data[0].id}`)
      .send({ number: "5593889718264344" })
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Payment method does not exist");
    expect(res.status).toBe(404);
  });
});
