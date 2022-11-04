import AppDataSource from "../../data-source";
import { Events } from "../../entities/event";
import { AppError } from "../../errors";

const deleteEventService = async (eventId: string) => {
    const eventRepository = AppDataSource.getRepository(Events);

    const event = await eventRepository.findOneBy({ id: eventId });
    if(!event) {
        throw new AppError('Event not found', 404);
    }

    await eventRepository.delete({ id: eventId });
}

export default deleteEventService;  