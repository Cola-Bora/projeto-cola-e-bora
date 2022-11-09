import AppDataSource from "../../data-source";
import { Events } from "../../entities/event";
import { AppError } from "../../errors";
import { UsersEvents } from "../../entities/userEvent";

export default async function listUsersEventOngService(idEvent: string) {
  const userEventsRepository = AppDataSource.getRepository(UsersEvents);
  const eventRepository = AppDataSource.getRepository(Events);

  if (idEvent.length !== 36) {
    throw new AppError("Id must have a valid uuid format", 400);
  }

  const eventFound = await eventRepository.findOneBy({
    id: idEvent,
  });

  if (!eventFound) {
    throw new AppError("Event not found", 404);
  }

  const users = await userEventsRepository.find({
    where: { event: eventFound },

    relations: {
      user: true,
    },
  });

  return users;
}
