import AppDataSource from '../../data-source';
import { AppError } from '../../errors';
import { Events } from '../../entities/event';
import { IEventResponse } from '../../interfaces/event';
import formatEventResponseUtil from '../../utils/formatEventResponse.util';

const listEventByIdService = async (eventId: string): Promise<IEventResponse> => {
  if (eventId.length !== 36) {
    throw new AppError('Invalid Id', 400);
  }

  const eventsRepository = AppDataSource.getRepository(Events);
  const event = await eventsRepository.findOne({
    where: { id: eventId },

    relations: {
      address: true,
      ong: true,
    },
  });

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  const formatedEvent = formatEventResponseUtil(event);

  return formatedEvent;
};

export default listEventByIdService;
