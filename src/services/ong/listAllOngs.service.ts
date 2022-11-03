import AppDataSource from "../../data-source";
import { Ongs } from "../../entities/ong";

export default async function () {
  const ongRepository = AppDataSource.getRepository(Ongs);
  const ongs = ongRepository.find({
    relations: {
      category: true,
    },
  });

  return ongs;
}
