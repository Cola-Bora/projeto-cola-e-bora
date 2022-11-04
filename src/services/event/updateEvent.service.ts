import AppDataSource from "../../data-source";
import { Addresses } from "../../entities/adress";
import { Events } from "../../entities/event";
import { Ongs } from "../../entities/ong";
import { AppError } from "../../errors";
import { IEventRequest } from "../../interfaces/event";

const updateEventService = async (eventId: string, { name, date, description, addressId, ongId }: IEventRequest) => {
    const eventRepository = AppDataSource.getRepository(Events);
    const addressRepository = AppDataSource.getRepository(Addresses);
    const ongRepository = AppDataSource.getRepository(Ongs);

    const findEvent = await eventRepository.findOneBy({ id: eventId });
    if(!findEvent) {
        throw new AppError('Event not found', 404);
    }

    const address = await addressRepository.findOneBy({ id: addressId });
    if(!address) {
        throw new AppError('Address not found', 404);
    }

    const ong = await ongRepository.findOneBy({ id: ongId });
    if(!ong) {
        throw new AppError('Ong not found', 404);
    }

    await eventRepository.update(
    eventId,    
    {
        name: name ? name : findEvent.name,
        description: description ? description : findEvent.description,
        date: date ? new Date(date) : findEvent.date,
        ong: ong! ? ong : findEvent.ong,
        address: address! ? address : findEvent.address
    });

    const updatedEvent = await eventRepository.findOneBy({ id: eventId });

    return updatedEvent;
}

export default updateEventService;  