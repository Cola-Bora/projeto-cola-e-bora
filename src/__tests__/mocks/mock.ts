import { IEventRequest } from "../../interfaces/event";
import { IUserRequest } from "../../interfaces/user";

export const mockedUser : IUserRequest = {
    name: "Mario",
    birthDate: "1998/10/12",
    email: "mario@mail.com",
    password: "12345678"
}

export const mockedUserAdim : IUserRequest = {
    name: "Mario",
    birthDate: "1998/10/12",
    email: "mario@mail.com",
    password: "12345678"
}

export const mockedUserAdimLogin = {
    email: "mario@mail.com",
    password: "12345678"
}

export const mockedOng = (categoryId: string) => {
    return {
        name: 'ong',
        email: 'ong@gmail.com',
        tel: '9999999999',
        description: 'description',
        cnpj: '0000000000000',
        categoryId: categoryId
    }
}

export const mockedEvent : (ongId: string) => IEventRequest = (ongId: string) => {
    return {
        name: "Event",
        description: "Description",
        date: "2022/11/22",
        address: {
            street: 'rua',
            number: '880',
            cep: '69400797',
            extra: 'rua'
        },
        ongId
    }
}

export const mockedUpdateEvent = (ongId: string) => {
    return {
        name: 'Event - updated',
        description: 'Description - updated',
        date: '2022/11/25',
        address: {
            street: 'rua - updated',
            number: '980',
            cep: '69400707',
            extra: 'Igreja'
        },
        ongId
    }
}