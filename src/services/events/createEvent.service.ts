import AppDataSource from "../../data-source";
import { Addresses } from "../../entities/adress";
import { Events } from "../../entities/event";
import { Ongs } from "../../entities/ong";
import { AppError } from "../../errors";
import { IEventRequest } from "../../interfaces/event";

const createEventService = async ({ name, date, description, address, ongId }: IEventRequest) => {
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

    const newDate = new Date(date);
    const event = await eventRepository.save({
        name,
        description,
        date: newDate,
        ong: ong!,
        address: newAddress!
    });

    return event;
}

export default createEventService;  