import AppDataSource from '../../data-source';
import { Events } from '../../entities/event';
import { Ongs } from '../../entities/ong';
import { AppError } from '../../errors';

const listEventsByOngService = async (ongId: string): Promise<Events[]> => {
  if (ongId.length !== 36) {
    throw new AppError('Invalid Id', 400);
  }

  const eventsRepository = AppDataSource.getRepository(Events);

  const events = await eventsRepository.find({
    where: { ong: { id: ongId } },
  });

  // const ongsRepository = AppDataSource.getRepository(Ongs);

  // const events = await ongsRepository.findOne({
  //   where: { id: ongId },
  //   relations: {
  //     events: true,
  //   },
  // });

  console.log(events);

  if (!events) {
    throw new AppError('Ong not found', 404);
  }

  return events;
};

export default listEventsByOngService;
