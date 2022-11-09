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

  test("POST /users/payments/:id - Must not create payment method if request body size is different than 3", async () => {
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

  test("POST /users/payments/:id - You must not create a payment method if there is a wrong key in the request body", async () => {
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

  test("POST /users/payments/:id - You must not create a payment method using another user's id or non-existent", async () => {
    const loginRes = await request(app).post("/login").send(mockedUserLogin);

    const res = await request(app)
      .post(`/users/payments/94e8d84f-f2e3-4811-975b-220dfae0186a`)
      .send(mockedPayment)
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Unauthorized");
    expect(res.status).toBe(401);
  });

  test("POST /users/payments/:id - Must not create payment method if token is invalid", async () => {
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

  test("POST /users/payments/:id - Must create payment method", async () => {
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

  test("POST /users/payments/:id - You should not create a payment method if there is one registered", async () => {
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
      "This card is already being used"
    );
    expect(res.status).toBe(400);
  });

  test("PATCH /users/payments/:id - Should not update payment method if it contains any wrong key in the request body", async () => {
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

  test("PATCH /users/payments/:id - Should not update payment method if token is invalid", async () => {
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

  test("PATCH /users/payments/:id - Must not update payment method using another user's id or non-existent", async () => {
    const loginRes = await request(app).post("/login").send(mockedUserLogin);

    const res = await request(app)
      .patch(`/users/payments/94e8d84f-f2e3-4811-975b-220dfae0186a`)
      .send(mockedPayment)
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Unauthorized");
    expect(res.status).toBe(401);
  });

  test("PATCH /users/payments/:id - Must update payment method", async () => {
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

  test("DELETE /users/payments/:id - Should not delete payment method if token is invalid", async () => {
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

  test("DELETE /users/payments/:id - You must not delete payment method using another user's id or non-existent", async () => {
    const loginRes = await request(app).post("/login").send(mockedUserLogin);

    const res = await request(app)
      .delete(`/users/payments/94e8d84f-f2e3-4811-975b-220dfae0186a`)
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Unauthorized");
    expect(res.status).toBe(401);
  });

  test("DELETE /users/payments/:id - Must delete payment method", async () => {
    const loginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    const res = await request(app)
      .delete(`/users/payments/${listUsers.body.data[0].id}`)
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.status).toBe(204);
  });

  test("PATCH /user/payments/:id - Must not update inactive user's payment method", async () => {
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

  test("DELETE /user/payments/:id - Must not delete inactive user's payment method", async () => {
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

  test("DELETE /users/payments/:id - Must not delete non-existent payment method", async () => {
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

  test("PATCH /users/payments/:id - Must not update non-existent payment method", async () => {
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
