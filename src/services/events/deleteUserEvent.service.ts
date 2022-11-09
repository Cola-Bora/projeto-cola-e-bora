import AppDataSource from "../../data-source";
import { Events } from "../../entities/event";
import { UsersEvents } from "../../entities/userEvent";
import { AppError } from "../../errors";

const deleteUserEventService = async (
  eventId: string,
  id: string
): Promise<void> => {
  const eventRepository = AppDataSource.getRepository(Events);
  const userEventRepository = AppDataSource.getRepository(UsersEvents);

  if (eventId.length !== 36)
    throw new AppError("Id must have a valid UUID format", 400);

  const event: Events | null = await eventRepository.findOneBy({
    id: eventId,
  });

  if (!event) throw new AppError("Event not found", 404);

  const userInEvent = userEventRepository.findOneBy({ user: { id: id } });

  if(!userInEvent) throw new AppError("User does not participate in this event", 404);

  await userEventRepository.delete({
    event: event,
    user: {
      id: id,
    },
  });

  return;
};

export default deleteUserEventService;
