import AppDataSource from '../../data-source';
import { Ongs } from '../../entities/ong';
import { AppError } from '../../errors';
import { Events } from '../../entities/event';
import formatEventResponseUtil from '../../utils/formatEventResponse.util';
import { IEventResponse } from '../../interfaces/event';

const listEventsByOngService = async (ongId: string): Promise<IEventResponse[]> => {
  if (ongId.length !== 36) {
    throw new AppError('Invalid Id', 400);
  }
  const ongRepository = AppDataSource.getRepository(Ongs);
  const eventsRepository = AppDataSource.getRepository(Events);

  const ong = await ongRepository.findOneBy({ id: ongId });
  if (!ong) {
    throw new AppError('Ong not found', 404);
  }

  const events = await eventsRepository.find({
    where: { ong: { id: ongId } },
    relations: {
      address: true,
    },
  });

  if (events.length < 1) {
    throw new AppError('There are no registered events', 404);
  }

  const formatedEvents = events.map(event => formatEventResponseUtil(event));

  return formatedEvents;
};

export default listEventsByOngService;
