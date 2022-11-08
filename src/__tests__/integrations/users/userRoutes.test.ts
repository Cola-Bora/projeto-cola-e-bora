import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import {
  mockedInvalidEmailLogin,
  mockedInvalidKeyLogin,
  mockedInvalidPasswordLogin,
  mockedInvalidRequestBody,
  mockedInvaliKey,
  mockedUser,
  mockedUserLogin,
} from "../../mocks/users/usersMocks";

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

  test("POST /users - Must not create user if request body size is different than 4", async () => {
    const res = await request(app)
      .post("/users")
      .send(mockedInvalidRequestBody);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Required field is missing");
    expect(res.status).toBe(400);
  });

  test("POST /users - Must not create user if there is any wrong key in the request body", async () => {
    const res = await request(app).post("/users").send(mockedInvaliKey);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Invalid key");
    expect(res.status).toBe(400);
  });

  test("POST /users - Must create a user", async () => {
    const res = await request(app).post("/users").send(mockedUser);

    expect(res.body.data).toHaveProperty("name");
    expect(res.body.data).toHaveProperty("email");
    expect(res.body.data).toHaveProperty("birthDate");
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data).toHaveProperty("createdAt");
    expect(res.body.data).toHaveProperty("updatedAt");
    expect(res.body.data).toHaveProperty("isAdm");
    expect(res.body.data).toHaveProperty("isActive");
    expect(res.body.data.email).toEqual("ana@gmail.com");
    expect(res.body.data.isAdm).toEqual(false);
    expect(res.body.data.isActive).toEqual(true);
    expect(res.status).toBe(201);
  });

  test("POST /users - Must not create user with existing email", async () => {
    const res = await request(app).post("/users").send(mockedUser);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("This email is already registered");
    expect(res.status).toBe(400);
  });

  test("POST /login - You must not log in a user that contains the wrong email in the body of the request", async () => {
    const res = await request(app).post("/login").send(mockedInvalidEmailLogin);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Invalid user or password");
    expect(res.status).toBe(403);
  });

  test("POST /login - You must not log in a user that contains the wrong password in the body of the request", async () => {
    const res = await request(app)
      .post("/login")
      .send(mockedInvalidPasswordLogin);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Invalid user or password");
    expect(res.status).toBe(403);
  });

  test("POST /login - You must not log in a user that contains a wrong key in the body of the request", async () => {
    const res = await request(app).post("/login").send(mockedInvalidKeyLogin);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Invalid key");
    expect(res.status).toBe(400);
  });

  test("POST /login - User must log in", async () => {
    const res = await request(app).post("/login").send(mockedUserLogin);

    expect(res.body).toHaveProperty("token");
    expect(res.status).toBe(200);
  });

  test("PATCH /user/:id - Must not change user data with invalid token", async () => {
    const LoginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    const res = await request(app)
      .patch(`/users/${listUsers.body.data[0].id}`)
      .send({ birthDate: "1991/10/10" })
      .set("Authorization", `Bearer ${"invalid token"}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Invalid token");
    expect(res.status).toBe(401);
  });

  test("PATCH /user/:id - Must not change another user's data", async () => {
    const LoginRes = await request(app).post("/login").send(mockedUserLogin);

    const res = await request(app)
      .patch(`/users/invalidId`)
      .send({ birthDate: "1991/10/10" })
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Unauthorized");
    expect(res.status).toBe(401);
  });

  test("PATCH /user/:id - Should not change user if there is any wrong key in the request body", async () => {
    const LoginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    const res = await request(app)
      .patch(`/users/${listUsers.body.data[0].id}`)
      .send({ birthDat: "1991/10/10" })
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Invalid key");
    expect(res.status).toBe(400);
  });

  test("PATCH /user/:id - Must change user data", async () => {
    const LoginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    const res = await request(app)
      .patch(`/users/${listUsers.body.data[0].id}`)
      .send({ name: "Ana Maria", birthDate: "1991/10/10" })
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data).toHaveProperty("name");
    expect(res.body.data).toHaveProperty("email");
    expect(res.body.data).toHaveProperty("birthDate");
    expect(res.body.data).toHaveProperty("createdAt");
    expect(res.body.data).toHaveProperty("updatedAt");
    expect(res.body.data).toHaveProperty("isAdm");
    expect(res.body.data).toHaveProperty("isActive");
    expect(res.body.data.name).toEqual("Ana Maria");
    expect(res.body.data.birthDate).toEqual("1991-10-10T00:00:00.000Z");
    expect(res.status).toBe(200);

    await request(app)
      .patch(`/users/${listUsers.body.data[0].id}`)
      .send({ name: "Ana", birthDate: "1990/10/10" })
      .set("Authorization", `Bearer ${LoginRes.body.token}`);
  });

  test("DELETE /user/:id - You should not soft delete a user with an invalid token", async () => {
    const LoginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    const res = await request(app)
      .delete(`/users/${listUsers.body.data[0].id}`)
      .set("Authorization", `Bearer ${"invalid token"}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Invalid token");
    expect(res.status).toBe(401);
  });

  test("DELETE /user/:id - Must not soft delete another user", async () => {
    const LoginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    const res = await request(app)
      .delete(`/users/invalidId`)
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Unauthorized");
    expect(res.status).toBe(401);
  });

  test("DELETE /user/:id - You must soft delete the user", async () => {
    const LoginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    const res = await request(app)
      .delete(`/users/${listUsers.body.data[0].id}`)
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    expect(res.status).toBe(204);
  });

  test("PATCH /user/:id - Must not change inactive user data", async () => {
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
      .patch(`/users/${listDeletedUser.body.data[0].id}`)
      .send({ name: "Ana Maria", birthDate: "1991/10/10" })
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("User inative");
    expect(res.status).toBe(400);
  });

  test("DELETE /user/:id - Must not soft delete an inactive user", async () => {
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
      .delete(`/users/${listDeletedUser.body.data[0].id}`)
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("User inative");
    expect(res.status).toBe(400);
  });

  test("POST /login - If the user is inactive, he must be reactivated when logging in.", async () => {
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
      .delete(`/users/${listDeletedUser.body.data[0].id}`)
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("User inative");
    expect(res.status).toBe(400);

    const LoginActiveUser = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const resActiveUser = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${LoginActiveUser.body.token}`);

    expect(resActiveUser.body.data[0]).toHaveProperty("isActive");
    expect(resActiveUser.body.data[0].isActive).toEqual(true);
    expect(resActiveUser.status).toBe(200);
  });
});
