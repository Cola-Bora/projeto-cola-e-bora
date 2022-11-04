import { mockedOngSecondary, mockedOngUpdate, mockedUser, mockedUserAdim, mockedUserLogin } from '../../mocks/mock';

import { DataSource } from "typeorm";
import request from "supertest"
import app from "../../../app";
import AppDataSource from "../../../data-source";
import { mockedOng, mockedOngMissingFields, mockedUserAdimLogin} from "../../mocks/mock";
import createBaseCategoriesService from "../../../services/categories/createBaseCategories.service";


describe("/ongs", () => {
    let connection: DataSource

    beforeAll(async() => {
        await AppDataSource.initialize().then((res) => {
            connection = res
        }).catch((err) => {
            console.error("Error during Data Source initialization", err)
        })

        await request(app).post('/users').send(mockedUserAdim)
        await request(app).post('/users').send(mockedUser)
        // const userLoginResponse = await request(app).post("/login").send(mockedUserLogin);
        // const ongCategory = await request(app).get('/categories')
    })

    afterAll(async() => {
        await connection.destroy()
    })

    test("POST /ongs - Should not be able to create a ong without required fields",async () => {
        const userLoginResponse = await request(app).post("/login").send(mockedUserAdimLogin);
        await createBaseCategoriesService()
        const ongCategory = await request(app).get('/categories').set("Authorization", `Bearer ${userLoginResponse.body.token}`)   
 
        const response = await request(app).post('/ongs').set("Authorization", `Bearer ${userLoginResponse.body.token}`).send(mockedOngMissingFields(ongCategory.body[0].id))

        expect(response.body).toHaveProperty("message")
        expect(response.status).toBe(400)
    })

    test("POST /ongs - Category does not exists in database",async () => {
        const userLoginResponse = await request(app).post("/login").send(mockedUserAdimLogin);
        await createBaseCategoriesService()
 
        const response = await request(app).post('/ongs').set("Authorization", `Bearer ${userLoginResponse.body.token}`).send(mockedOng("___false-category___"))
        expect(response.body).toHaveProperty("message")
        expect(response.status).toBe(404)
    })


    test("POST /ongs - Must be able to create a ong",async () => {
        const userLoginResponse = await request(app).post("/login").send(mockedUserAdimLogin);
        await createBaseCategoriesService()
        const ongCategory = await request(app).get('/categories').set("Authorization", `Bearer ${userLoginResponse.body.token}`)
       
        const response = await request(app).post('/ongs').set("Authorization", `Bearer ${userLoginResponse.body.token}`).send(mockedOng(ongCategory.body[0].id))

        expect(response.body.data).toHaveProperty("id")
        expect(response.body.data).toHaveProperty("name")
        expect(response.body.data).toHaveProperty("email")
        expect(response.body.data).toHaveProperty("tel")
        expect(response.body.data).toHaveProperty("description")
        expect(response.body.data).toHaveProperty("cpnj")
        expect(response.body.data).toHaveProperty("createdAt")
        expect(response.body.data).toHaveProperty("updatedAt")
        expect(response.body.data).toHaveProperty("balance")
        expect(response.status).toBe(201)
     
    })

    test("POST /ongs - Email/Cnpj is already being used",async () => {
        const userLoginResponse = await request(app).post("/login").send(mockedUserAdimLogin);
        await createBaseCategoriesService()
        const ongCategory = await request(app).get('/categories').set("Authorization", `Bearer ${userLoginResponse.body.token}`)
        const response = await request(app).post('/ongs').set("Authorization", `Bearer ${userLoginResponse.body.token}`).send(mockedOng(ongCategory.body[0].id))

        expect(response.body).toHaveProperty("message")
        expect(response.status).toBe(400)
    })

    test("POST /ongs - User is already linked to a ong",async () => {
        const userLoginResponse = await request(app).post("/login").send(mockedUserAdimLogin);
        await createBaseCategoriesService()
        const ongCategory = await request(app).get('/categories').set("Authorization", `Bearer ${userLoginResponse.body.token}`)
        const response = await request(app).post('/ongs').set("Authorization", `Bearer ${userLoginResponse.body.token}`).send(mockedOng(ongCategory.body[0].id))

        expect(response.body).toHaveProperty("message")
        expect(response.status).toBe(400)
    })

    test("PATCH /ongs/:ongId - Id must have a valid uuid format",async () => {
        const userLoginResponse = await request(app).post("/login").send(mockedUserAdimLogin);

        const response = await request(app).patch("/ongs/0bd5e233-aa03-4e4a-8cfe-390ed1511").set("Authorization", `Bearer ${userLoginResponse.body.token}`).send(mockedOngUpdate)
        
        expect(response.body).toHaveProperty("message")
        expect(response.status).toBe(400)
    })

    test("PATCH /ongs/:ongId - Ong not found",async () => {
        const userLoginResponse = await request(app).post("/login").send(mockedUserAdimLogin);

        const response = await request(app).patch("/ongs/0bd5e233-aa03-4e4a-8cfe-390ed1511713").set("Authorization", `Bearer ${userLoginResponse.body.token}`).send(mockedOngUpdate)
        
        expect(response.body).toHaveProperty("message")
        expect(response.status).toBe(404)
    })

    test("PATCH /ongs/:ongId - Unauthorized",async () => {
        const testLoginResponse = await request(app).post("/login").send(mockedUserLogin);
        await createBaseCategoriesService()
        const testOngCategory = await request(app).get('/categories').set("Authorization", `Bearer ${testLoginResponse.body.token}`)
        const testOngResponse = await request(app).post('/ongs').set("Authorization", `Bearer ${testLoginResponse.body.token}`).send(mockedOngSecondary(testOngCategory.body[0].id))

        const userLoginResponse = await request(app).post("/login").send(mockedUserAdimLogin);
        const response = await request(app).patch(`/ongs/${testOngResponse.body.data.id}`).set("Authorization", `Bearer ${userLoginResponse.body.token}`).send(mockedOngUpdate)
        
        expect(response.body).toHaveProperty("message")
        expect(response.status).toBe(401)
    })

    test("PATCH /ongs/:ongId - Should be able to update a ONG", async () => {
        const userLoginResponse = await request(app).post("/login").send(mockedUserAdimLogin);
        const ongToBeUpdatedRequest = await request(app).get('/ongs').set("Authorization", `Bearer ${userLoginResponse.body.token}`)
        const ongToBeUpdatedId = ongToBeUpdatedRequest.body.data[0].id
        const response = await request(app).patch(`/ongs/${ongToBeUpdatedId}`).set("Authorization", `Bearer ${userLoginResponse.body.token}`).send(mockedOngUpdate)
 

        expect(response.body.data).toHaveProperty("balance")
        expect(response.body.data).toHaveProperty("id")
        expect(response.body.data).toHaveProperty("name")
        expect(response.body.data).toHaveProperty("email")
        expect(response.body.data).toHaveProperty("tel")
        expect(response.body.data).toHaveProperty("description")
        expect(response.body.data).toHaveProperty("cpnj")
        expect(response.body.data).toHaveProperty("createdAt")
        expect(response.body.data).toHaveProperty("updatedAt")
        expect(response.status).toBe(200)
    })


    // test("DELETE /ongs/:ongId - Should be able to delete a ong",async () => {
    //     const userLoginResponse = await request(app).post("/login").send(mockedUserAdimLogin);

    //     const ongToBeDeletedRequest = await request(app).get('/ongs').set("Authorization", `Bearer ${userLoginResponse.body.token}`)
    //     console.log(ongToBeDeletedRequest.body)
    //     const ongToBeDeletedId = ongToBeDeletedRequest.body.data[0].id
    //     const response = await request(app).delete(`/ongs/${ongToBeDeletedId}`).set("Authorization", `Bearer ${userLoginResponse.body.token}`)
        
    //     expect(response.body).toBeNull
    //     expect(response.status).toBe(204)
    // })


})