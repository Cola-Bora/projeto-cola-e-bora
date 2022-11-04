import AppDataSource from "../../data-source";
import { Addresses } from "../../entities/adress";
import { Events } from "../../entities/event";
import { Ongs } from "../../entities/ong";
import { IEventRequest } from "../../interfaces/event";

const createEventService = async ({ name, date, description, addressId, ongId }: IEventRequest) => {
    const eventRepository = AppDataSource.getRepository(Events);
    const addressRepository = AppDataSource.getRepository(Addresses);
    const ongRepository = AppDataSource.getRepository(Ongs);

    const address = await addressRepository.findOneBy({ id: addressId });
    const ong = await ongRepository.findOneBy({ id: ongId });

    const newDate = new Date(date);
    const event = await eventRepository.save({
        name,
        description,
        date: newDate,
        ong: ong!,
        address: address!
    });

    return event;
}

export default createEventService;  