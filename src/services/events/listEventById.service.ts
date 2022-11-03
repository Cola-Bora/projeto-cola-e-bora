import AppDataSource from '../../data-source';
import { AppError } from '../../errors';
import { Events } from '../../entities/event';

const listEventByIdService = async (eventId: string): Promise<Events> => {
  const eventsRepository = AppDataSource.getRepository(Events);
  const event = await eventsRepository.findOneBy({ id: eventId });

  if (!event) {
    throw new AppError('Event not found', 404);
  }
  return event;
};

export default listEventByIdService;
