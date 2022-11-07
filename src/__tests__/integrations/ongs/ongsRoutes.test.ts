import {
  mockedEvent,
  mockedOngSecondary,
  mockedOngUpdate,
  mockedUser,
  mockedUserAdim,
  mockedUserLogin,
  mockedUserNotAdim,
  mockedUserNotAdimLogin,
} from "../../mocks/mock";

import { DataSource } from "typeorm";
import request from "supertest";
import app from "../../../app";
import AppDataSource from "../../../data-source";
import {
  mockedOng,
  mockedOngMissingFields,
  mockedUserAdimLogin,
} from "../../mocks/mock";
import createBaseCategoriesService from "../../../services/categories/createBaseCategories.service";

describe("/ongs", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    await request(app).post("/users").send(mockedUserAdim);
    await request(app).post("/users").send(mockedUser);
    await request(app).post("/users").send(mockedUserNotAdim);
    // const userLoginResponse = await request(app).post("/login").send(mockedUserLogin);
    // const ongCategory = await request(app).get('/categories')
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /ongs - Should not be able to create a ong without required fields", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserAdimLogin);
    await createBaseCategoriesService();
    const ongCategory = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    const response = await request(app)
      .post("/ongs")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedOngMissingFields(ongCategory.body[0].id));

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(400);
  });

  test("POST /ongs - Should not be able to create a ONG without a valid category id", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserAdimLogin);
    await createBaseCategoriesService();

    const response = await request(app)
      .post("/ongs")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedOng("___false-category___"));
    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("POST /ongs - Must be able to create a ong", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserAdimLogin);
    await createBaseCategoriesService();
    const ongCategory = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    const response = await request(app)
      .post("/ongs")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedOng(ongCategory.body[0].id));

    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("name");
    expect(response.body.data).toHaveProperty("email");
    expect(response.body.data).toHaveProperty("tel");
    expect(response.body.data).toHaveProperty("description");
    expect(response.body.data).toHaveProperty("cpnj");
    expect(response.body.data).toHaveProperty("createdAt");
    expect(response.body.data).toHaveProperty("updatedAt");
    expect(response.body.data).toHaveProperty("balance");
    expect(response.status).toBe(201);
  });

  test("POST /ongs - Email/Cnpj is already being used", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserAdimLogin);
    await createBaseCategoriesService();
    const ongCategory = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);
    const response = await request(app)
      .post("/ongs")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedOng(ongCategory.body[0].id));

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(400);
  });

  test("POST /ongs - Should not be able to create a ONG if alread owns a ONG", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserAdimLogin);
    await createBaseCategoriesService();
    const ongCategory = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);
    const response = await request(app)
      .post("/ongs")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedOng(ongCategory.body[0].id));

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(400);
  });

  test("PATCH /ongs/:ongId - Id must have a valid uuid format", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserAdimLogin);

    const response = await request(app)
      .patch("/ongs/0bd5e233-aa03-4e4a-8cfe-390ed1511")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedOngUpdate);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(400);
  });

  test("PATCH /ongs/:ongId - Ong not found", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserAdimLogin);

    const response = await request(app)
      .patch("/ongs/0bd5e233-aa03-4e4a-8cfe-390ed1511713")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedOngUpdate);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("PATCH /ongs/:ongId - Should not be able to update a ONG if it is not it's admin", async () => {
    const testLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);
    await createBaseCategoriesService();
    const testOngCategory = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${testLoginResponse.body.token}`);
    const testOngResponse = await request(app)
      .post("/ongs")
      .set("Authorization", `Bearer ${testLoginResponse.body.token}`)
      .send(mockedOngSecondary(testOngCategory.body[0].id));

    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserAdimLogin);
    const response = await request(app)
      .patch(`/ongs/${testOngResponse.body.data.id}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedOngUpdate);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("PATCH /ongs/:ongId - Should be able to update a ONG", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserAdimLogin);
    const ongToBeUpdatedRequest = await request(app)
      .get("/ongs")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);
    const ongToBeUpdatedId = ongToBeUpdatedRequest.body.data[0].id;
    const response = await request(app)
      .patch(`/ongs/${ongToBeUpdatedId}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedOngUpdate);

    expect(response.body.data).toHaveProperty("balance");
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("name");
    expect(response.body.data).toHaveProperty("email");
    expect(response.body.data).toHaveProperty("tel");
    expect(response.body.data).toHaveProperty("description");
    expect(response.body.data).toHaveProperty("cpnj");
    expect(response.body.data).toHaveProperty("createdAt");
    expect(response.body.data).toHaveProperty("updatedAt");
    expect(response.status).toBe(200);
  });

  test("DELETE /ongs/:ongId - Should not be able to delete a ONG with a invalid uuid", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserAdimLogin);
    const falseUuid = "3e13confirma3bb-9423-75b1___3";

    const response = await request(app)
      .delete(`/ongs/${falseUuid}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body.message).toBe("Id must have a valid uuid format");
    expect(response.status).toBe(400);
  });

  test("DELETE /ongs/:ongId - Should not be able to delete a ONG if user is not Ong admin", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserAdimLogin);
    const ongToBeDeletedRequest = await request(app).get("/ongs");
    const ongToBeDeletedId = ongToBeDeletedRequest.body.data[1].id;

    const response = await request(app)
      .delete(`/ongs/${ongToBeDeletedId}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body.message).toBe("Unauthorized");
    expect(response.status).toBe(401);
  });

  test("DELETE /ongs/:ongId - Should not be able to delete a ONG without it's uuid", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserAdimLogin);
    const falseOngUuid = "3ec70938-f10a-4fbb-9423-75b1e7af3d60";
    const response = await request(app)
      .delete(`/ongs/${falseOngUuid}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body.message).toBe("ONG not found");
    expect(response.status).toBe(404);
  });

  test("DELETE /ongs/:ongId - Should be able to delete a ong", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserAdimLogin);

    const ongToBeDeletedRequest = await request(app).get("/ongs");

    const ongToBeDeletedId = ongToBeDeletedRequest.body.data[0].id;

    const response = await request(app)
      .delete(`/ongs/${ongToBeDeletedId}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toBeNull;
    expect(response.status).toBe(204);
  });

  test("GET - /ongs - Should be able to list all ongs", async () => {
    const response = await request(app).get("/ongs");

    expect(response.body.data).toHaveLength(1);
    expect(response.status).toBe(200);
  });

  test("GET - /ongs/:ongId - Ong not found not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserNotAdimLogin);

    await request(app).get("/ongs");
    const response = await request(app)
      .get("/ongs/0bd5e233-aa03-4e4a-8cfe-390ed1511713")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body.message).toBe("Ong not found");
    expect(response.status).toBe(404);
  });

  test("GET - /ongs/:ongId - Must be able to list a ong not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserNotAdimLogin);

    const ongToList = await request(app).get("/ongs");
    const ongIdToList = ongToList.body.data[0].id;

    const response = await request(app)
      .get(`/ongs/${ongIdToList}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("name");
    expect(response.body.data).toHaveProperty("email");
    expect(response.body.data).toHaveProperty("tel");
    expect(response.body.data).toHaveProperty("description");
    expect(response.body.data).toHaveProperty("cpnj");
    expect(response.body.data).toHaveProperty("createdAt");
    expect(response.body.data).toHaveProperty("updatedAt");
    expect(response.body.data).not.toHaveProperty("balance");
    expect(response.body.data.category).toHaveProperty("id");
    expect(response.body.data.category).toHaveProperty("name");
    expect(response.status).toBe(200);
  });

  test("GET - /ongs/:ongId - Ong not found being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserAdimLogin);

    await request(app).get("/ongs");
    const response = await request(app)
      .get("/ongs/0bd5e233-aa03-4e4a-8cfe-390ed1511713")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body.message).toBe("Ong not found");
    expect(response.status).toBe(404);
  });

  test("GET - /ongs/:ongId - Must be able to list a ong being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserAdimLogin);

    const ongToList = await request(app).get("/ongs");
    const ongIdToList = ongToList.body.data[0].id;

    const response = await request(app)
      .get(`/ongs/${ongIdToList}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("name");
    expect(response.body.data).toHaveProperty("email");
    expect(response.body.data).toHaveProperty("tel");
    expect(response.body.data).toHaveProperty("description");
    expect(response.body.data).toHaveProperty("cpnj");
    expect(response.body.data).toHaveProperty("createdAt");
    expect(response.body.data).toHaveProperty("updatedAt");
    expect(response.body.data.category).toHaveProperty("id");
    expect(response.body.data.category).toHaveProperty("name");
    expect(response.status).toBe(200);
  });

  test("GET /ongs/:ongId/:eventId/users - Id must have a valid uuid format", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const ongToList = await request(app).get("/ongs");
    const ongIdToList = ongToList.body.data[0].id;

    const response = await request(app)
      .get(`/ongs/${ongIdToList}/0bd5e233-aa03-4e4a-8cfe-390ed15117/users`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body.message).toBe("Id must have a valid UUID format");
    expect(response.status).toBe(400);
  });

  test("GET /ongs/:ongId/:eventId/users - Should not be able to list users of an event with id event invalid", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const ongToList = await request(app).get("/ongs");
    const ongIdToList = ongToList.body.data[0].id;

    const response = await request(app)
      .get(`/ongs/${ongIdToList}/0bd5e233-aa03-4e4a-8cfe-390ed1511713/users`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body.message).toBe("Event not found");
    expect(response.status).toBe(404);
  });

  test("GET /ongs/:ongId/:eventId/users - Should not be able to list users of an event if it's not admin ", async () => {
    await request(app).post("/login").send(mockedUserLogin);
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserAdimLogin);

    const ongToList = await request(app).get("/ongs");
    const ongIdToList = ongToList.body.data[0].id;

    const response = await request(app)
      .get(`/ongs/${ongIdToList}/eventId/users`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body.message).toBe("Unauthorized");
    expect(response.status).toBe(401);
  });

  test("GET /ongs/:ongId/:eventId/users - Should be able to list users of an event of an ong", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const ongToList = await request(app).get("/ongs");
    console.log(ongToList.body.data);
    const ongIdToList = ongToList.body.data[0].id;

    const allEvents = await request(app).get("/events");
    console.log(allEvents.body.data);

    const response = await request(app)
      .get(`/ongs/${ongIdToList}/0bd5e233-aa03-4e4a-8cfe-390ed1511713/users`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    console.log(response.body);
  });
});
