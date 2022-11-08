import { UsersEvents } from './../../../entities/userEvent';
import { mockedUserAdim } from './../../mocks/mock';
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
import { mockedEvent, mockedOngSecondary, mockedUserAdimLogin } from "../../mocks/mock";
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

  test("POST /users - Não deve criar usuário se o tamanho do corpo da requisição for diferente de 4", async () => {
    const res = await request(app)
      .post("/users")
      .send(mockedInvalidRequestBody);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Required field is missing");
    expect(res.status).toBe(400);
  });

  test("POST /users - Não deve criar usuário caso contenha alguma chave errada no corpo da requisição", async () => {
    const res = await request(app).post("/users").send(mockedInvaliKey);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Invalid key");
    expect(res.status).toBe(400);
  });

  test("POST /users - Deve criar um usuário", async () => {
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

  test("POST /users - Não deve criar usuário com email existente", async () => {
    const res = await request(app).post("/users").send(mockedUser);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("This email is already registered");
    expect(res.status).toBe(400);
  });

  test("POST /login - Não deve logar usuário que contenha email errado no corpo da requisição", async () => {
    const res = await request(app).post("/login").send(mockedInvalidEmailLogin);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Invalid user or password");
    expect(res.status).toBe(403);
  });

  test("POST /login - Não deve logar usuário que contenha senha errada no corpo da requisição", async () => {
    const res = await request(app)
      .post("/login")
      .send(mockedInvalidPasswordLogin);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Invalid user or password");
    expect(res.status).toBe(403);
  });

  test("POST /login - Não deve logar usuário que contenha alguma chave errada no corpo da requisição", async () => {
    const res = await request(app).post("/login").send(mockedInvalidKeyLogin);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Invalid key");
    expect(res.status).toBe(400);
  });

  test("POST /login - Deve logar o usuário", async () => {
    const res = await request(app).post("/login").send(mockedUserLogin);

    expect(res.body).toHaveProperty("token");
    expect(res.status).toBe(200);
  });

  test("PATCH /user/:id - Não deve alterar dados do usuário com token inválido", async () => {
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

  test("PATCH /user/:id - Não deve alterar dados de outro usuário", async () => {
    const LoginRes = await request(app).post("/login").send(mockedUserLogin);

    const res = await request(app)
      .patch(`/users/invalidId`)
      .send({ birthDate: "1991/10/10" })
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Unauthorized");
    expect(res.status).toBe(401);
  });

  test("PATCH /user/:id - Não deve alterar usuário caso contenha alguma chave errada no corpo da requisição ", async () => {
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

  test("PATCH /user/:id - Deve alterar dado(s) do usuário", async () => {
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

  test("DELETE /user/:id - Não deve realizar soft delete em usuário com token inválido", async () => {
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

  test("DELETE /user/:id - Não deve realizar soft delete em outro usuário", async () => {
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

  test("DELETE /user/:id - Deve realizar soft delete no usuário", async () => {
    const LoginRes = await request(app).post("/login").send(mockedUserLogin);

    const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    const res = await request(app)
      .delete(`/users/${listUsers.body.data[0].id}`)
      .set("Authorization", `Bearer ${LoginRes.body.token}`);

    expect(res.status).toBe(204);
  });

  test("PATCH /user/:id - Não deve alterar dado(s) do usuário inativo", async () => {
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

  test("DELETE /user/:id - Não deve realizar soft delete em usuário inativo", async () => {
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

  test("POST /login - Caso o usuário esteja inativo se deve reativá-lo ao realizar login", async () => {
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


  test("GET /users/:userId - Should be able to list user with the events he is registered", async () => {
    await request(app).post("/users").send(mockedUserAdim);
    const testLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserAdimLogin);

      
    await createBaseCategoriesService();
    const testOngCategory = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${testLoginResponse.body.token}`);
    const testOngResponse = await request(app)
      .post("/ongs")
      .set("Authorization", `Bearer ${testLoginResponse.body.token}`)
      .send(mockedOngSecondary(testOngCategory.body[0].id));
    const testEventResponse = await request(app)
      .post("/ongs/events")
      .set("Authorization", `Bearer ${testLoginResponse.body.token}`)
      .send(mockedEvent(testOngResponse.body.data.id));

    
      const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);
      const userRegisterEvent = await request(app)
      .post(`/events/${testEventResponse.body.data.id}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      const listUsers = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)

      const res = await request(app)
      .get(`/users/${listUsers.body.data[0].id}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)

      expect(res.status).toBe(200)
      expect(res.body.data).toHaveProperty("id")
      expect(res.body.data).toHaveProperty("name")
      expect(res.body.data).not.toHaveProperty("password")
      expect(res.body).toHaveProperty("data.userEvents[0].id")
  })

  test("GET /users/:userId - Should not be able to list info if it is not the authorized user", async () => {
    const userLoginResponse = await request(app)
    .post("/login")
    .send(mockedUserLogin);

    const listUsers = await request(app)
    .get("/users")
    .set("Authorization", `Bearer ${userLoginResponse.body.token}`)

    const res = await request(app)
    .get(`/users/${listUsers.body.data[1].id}`)
    .set("Authorization", `Bearer ${userLoginResponse.body.token}`)

    expect(res.status).toBe(401)
    expect(res.body.message).toEqual("Unauthorized")
  })

});
