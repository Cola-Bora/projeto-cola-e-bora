import AppDataSource from "../../data-source"
import { Events } from "../../entities/event"
import { IEventResponse } from "../../interfaces/event";
import formatEventResponseUtil from "../../utils/formatEventResponse.util";

const listEventsService = async (): Promise<IEventResponse[]> => {
    const eventRepository = AppDataSource.getRepository(Events)

    const events = await eventRepository.find({
        relations: {
            address: true,
            ong: true
        }
    });

    const formatedEvents = events.map(event => formatEventResponseUtil(event));

    return formatedEvents;
}

export default listEventsService