import AppDataSource from "../../data-source";
import { Ongs } from "../../entities/ong";
import { User } from "../../entities/user";
import { AppError } from "../../errors";

export default async function listOngByIdService(ongId: string) {
  const userRepository = AppDataSource.getRepository(User);
  const ongRepository = AppDataSource.getRepository(Ongs);

  if (ongId.length !== 36) {
    throw new AppError("Invalid Id", 400);
  }

  const ongFound = await ongRepository.findOne({
    where: {
      id: ongId,
    },
    relations: {
      category: true,
    },
  });

  if (!ongFound) {
    throw new AppError("Ong not found", 404);
  }

  console.log(ongFound);
  return ongFound;
}
