import AppDataSource from "../../data-source";
import { Events } from "../../entities/event";
import { User } from "../../entities/user";
import { AppError } from "../../errors";

const listUserInEventByIdService = async (eventId: string, userId: string) => {
    const userRepository = AppDataSource.getRepository(User);
    const eventRepository = AppDataSource.getRepository(Events);

    const event = await eventRepository.findOne({
        where: {
            id: eventId
        },
        relations: {
            userEvents: true
        }
    });

    const findUserEvent = event?.userEvents.find((userEvent) => {
        return userEvent.user.id === userId;
    });

    if(!findUserEvent) {
        throw new AppError('The user is not in this event', 404);
    }

    return findUserEvent.user;
}

export default listUserInEventByIdService;