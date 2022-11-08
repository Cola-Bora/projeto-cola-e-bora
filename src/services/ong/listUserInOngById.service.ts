import AppDataSource from "../../data-source";
import { Events } from "../../entities/event";
import { Ongs } from "../../entities/ong";
import { User } from "../../entities/user";
import { UsersEvents } from "../../entities/userEvent";
import { AppError } from "../../errors";

const listUserInOngByIdService = async (admId: string, userId: string) => {
    const userRepository = AppDataSource.getRepository(User);
    const ongRepository = AppDataSource.getRepository(Ongs);
    const eventRepository = AppDataSource.getRepository(Events);
    const usersEventsRepository = AppDataSource.getRepository(UsersEvents);

    const userFind = await userRepository.findOneBy({
        id: userId
    });

    if(!userFind) {
        throw new AppError('User not found', 404)
    }

    const ong = await ongRepository.findOne({
        where: {
            user: {
                id: admId
            }
        },
    });

    if(!ong) {
        throw new AppError('You are not adm of this ong', 401);
    }

    const events = await eventRepository.find({
        where: {
            ong: {
                id: ong.id
            }
        },
        relations: {
            userEvents: true
        }
    });

    const usersEvents = await usersEventsRepository.find({
        where: {
            event: {
                ong: {
                    id:ong.id
                }
            }
        },
        relations: {
            user: true,
            event: true
        }
    });

    const eventsWithUser : Events[] = [];
    events.forEach((event) => {
        const eventHasUser = usersEvents.find(userEvent => {
            return userEvent.event.id === event.id && userEvent.user.id === userId;
        });

        if(eventHasUser) {
            eventsWithUser.push(event);
        }
    });

    if(!eventsWithUser) {
        throw new AppError('This user is not participating of this ong', 404);
    }

    return {
        user: userFind,
        eventsParticipate: eventsWithUser
    }
}

export default listUserInOngByIdService;