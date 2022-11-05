import AppDataSource from "../../data-source";
import { Events } from "../../entities/event";
import { AppError } from "../../errors";
import { UsersEvents } from "../../entities/userEvent";

export default async function listUsersEventOngService(idEvent: string) {
  const userEventsRepository = AppDataSource.getRepository(UsersEvents);
  const eventRepository = AppDataSource.getRepository(Events);

  const eventFound = eventRepository.findOneBy({
    id: idEvent,
  });

  if (!eventFound) {
    throw new AppError("Event not found");
  }

  if (idEvent.length < 36) {
    throw new AppError("Id must have a valid UUID format");
  }

  const users = userEventsRepository.find({
    where: {
      event: {
        id: idEvent,
      },
    },
    relations: {
      user: true,
    },
  });
  return users;
}
