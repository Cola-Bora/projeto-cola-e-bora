import AppDataSource from "../../data-source";
import { Ongs } from "../../entities/ong";
import { Events } from "../../entities/event";
import { AppError } from "../../errors";

export default async function listUsersEventOngService(idEvent: string) {
  const ongRepository = AppDataSource.getRepository(Ongs);
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

  const ongFound = ongRepository.findOne({
    where: {},
  });
}
