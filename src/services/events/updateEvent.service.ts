import AppDataSource from "../../data-source";
import { Addresses } from "../../entities/adress";
import { Events } from "../../entities/event";
import { Ongs } from "../../entities/ong";
import { AppError } from "../../errors";
import { IEventRequest, IEventResponse, IEventUpdateRequest } from "../../interfaces/event";
import formatEventResponseUtil from "../../utils/formatEventResponse.util";

const updateEventService = async (eventId: string, { name, date, description, address }: IEventUpdateRequest): Promise<IEventResponse> => {
    const eventRepository = AppDataSource.getRepository(Events);
    const addressRepository = AppDataSource.getRepository(Addresses);

    const findEvent = await eventRepository.findOneBy({ id: eventId });
    if(!findEvent) {
        throw new AppError('Event not found', 404);
    }

    const newAddress = await addressRepository.save({
        street: address.street,
        number: address.number,
        cep: address.cep,
        extra: address.extra
    });

    await eventRepository.update(
    eventId,    
    {
        name: name ? name : findEvent.name,
        description: description ? description : findEvent.description,
        date: date ? new Date(date) : findEvent.date,
        ong: findEvent.ong,
        address: address! ? newAddress : findEvent.address
    });

    const updatedEvent = await eventRepository.findOneBy({ id: eventId });

    const formatedEvent = formatEventResponseUtil(updatedEvent!);

    return formatedEvent;
}

export default updateEventService;  