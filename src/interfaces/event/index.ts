import { Addresses } from "../../entities/adress";
import { Ongs } from "../../entities/ong";
import { IAddressRequest } from "../address";

export interface IEventRequest {
    name: string,
    date: string,
    description: string,
    address: IAddressRequest,
    ongId: string,
}

export interface IEventResponse {
    id: string,
    name: string,
    date: string,
    description: string,
    address: Addresses,
    ong: Ongs,
}

export interface IEventUpdateRequest {
    name: string,
    date: string,
    description: string,
    address: IAddressRequest,
}