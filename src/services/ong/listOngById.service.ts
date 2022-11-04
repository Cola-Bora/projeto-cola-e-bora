import AppDataSource from "../../data-source";
import { Ongs } from "../../entities/ong";
import { AppError } from "../../errors";

export default async function listOngByIdService(ongId: string) {
  const ongRepository = AppDataSource.getRepository(Ongs);

  const ongFound = await ongRepository.findOne({
    where: {
      id: ongId,
    },
    relations: {
      category: true,
    },
  });

  if (!ongFound) {
    throw new AppError("Ong not found");
  }
  return ongFound;
}
