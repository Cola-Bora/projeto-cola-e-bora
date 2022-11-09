import AppDataSource from "../../data-source";
import { Addresses } from "../../entities/adress";
import { Events } from "../../entities/event";
import { Ongs } from "../../entities/ong";
import { AppError } from "../../errors";
import { IEventRequest, IEventResponse } from "../../interfaces/event";
import formatEventResponseUtil from "../../utils/formatEventResponse.util";

const createEventService = async ({ name, date, description, address, ongId }: IEventRequest): Promise<IEventResponse> => {
    const eventRepository = AppDataSource.getRepository(Events);
    const addressRepository = AppDataSource.getRepository(Addresses);
    const ongRepository = AppDataSource.getRepository(Ongs);

    const newAddress = await addressRepository.save({
        street: address.street,
        number: address.number,
        cep: address.cep,
        extra: address.extra
    });

    const ong = await ongRepository.findOneBy({ id: ongId });
    if(!ong) {
        throw new AppError('Ong not found', 404);
    }

    const now = new Date();
    const newDate = new Date(date);

    if(newDate.getTime() < now.getTime()) {
        throw new AppError('The event date cannot be a past date', 400);
    }

    const event = await eventRepository.save({
        name,
        description,
        date: newDate,
        ong: ong!,
        address: newAddress!
    });

    const formatedEvent = formatEventResponseUtil(event);

    return formatedEvent;
}

export default createEventService;  