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

export const mockedOngCategory = {
    id: '1',
    name: 'category'
}

export const mockedOng = {
    id: '1',
    name: 'ong',
    email: 'ong@gmail.com',
    tel: '9999999999',
    description: 'description',
    cnpj: '0000000000000',
    categoryId: 1
}

export const mockedAddress = {
    id: '1',
    street: 'rua',
    number: '880',
    cep: '69400797',
    extra: 'casa'
}

export const mockedEvent : IEventRequest = {
    name: "Event",
    description: "Description",
    date: "2022/11/22",
    addressId: '1',
    ongId: '1'
}