import AppDataSource from "../../data-source"
import { Events } from "../../entities/event"

const listEventsService = async (): Promise<Events[]> => {
    const eventRepository = AppDataSource.getRepository(Events)

    const events = eventRepository.find({
        relations: {
            address: true,
            ong: true
        }
    })

    return events
}

export default listEventsService