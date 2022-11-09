import { IAddressRequest } from "../address";

export interface IEventRequest {
    name: string,
    date: string,
    description: string,
    address: IAddressRequest,
    ongId: string,
}

export interface IEventUpdateRequest {
    name: string,
    date: string,
    description: string,
    address: IAddressRequest,
}