import AppDataSource from "../../data-source";
import { Events } from "../../entities/event";
import { AppError } from "../../errors";

const deleteEventService = async (eventId: string) => {
    const eventRepository = AppDataSource.getRepository(Events);

    const event = await eventRepository.findOneBy({ id: eventId });
    if(!event) {
        throw new AppError('Event not found', 404);
    }

    const res = await AppDataSource
                        .createQueryBuilder()
                        .delete()
                        .from(Events)
                        .where('id = :id', { id: eventId })
                        .execute();
                        
    return res;
}

export default deleteEventService;  