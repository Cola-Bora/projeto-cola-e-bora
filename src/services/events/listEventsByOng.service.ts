import AppDataSource from '../../data-source';
import { Ongs } from '../../entities/ong';
import { AppError } from '../../errors';

const listEventsByOngService = async (ongId: string): Promise<Ongs> => {
  const ongsRepository = AppDataSource.getRepository(Ongs);

  const events = await ongsRepository.findOne({
    where: { id: ongId },
    relations: {
      events: true,
    },
  });

  if (!events) {
    throw new AppError('Ong not found', 404);
  }

  return events;
};

export default listEventsByOngService;
