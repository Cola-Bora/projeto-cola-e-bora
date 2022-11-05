import AppDataSource from '../../data-source';
import { Events } from '../../entities/event';
import { User } from '../../entities/user';
import { UsersEvents } from '../../entities/userEvent';
import { AppError } from '../../errors';

const registerUserEventService = async (
  eventId: string,
  id: string
): Promise<string> => {
  const eventRepository = AppDataSource.getRepository(Events);
  const userEventRepository = AppDataSource.getRepository(UsersEvents);

  if (eventId.length !== 36) throw new AppError('Id must have a valid UUID format', 400);

  const event: Events | null = await eventRepository.findOneBy({
    id: eventId,
  });

  if (!event) throw new AppError('Event not found', 404);

  const confirmEvent = userEventRepository.create({
    user: {
      id: id,
    },
    event: event,
  });

  await userEventRepository.save(confirmEvent);

  return 'User successfully registered on event.';
};

export default registerUserEventService;
