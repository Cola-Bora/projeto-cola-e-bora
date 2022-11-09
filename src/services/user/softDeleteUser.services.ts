import AppDataSource from "../../data-source";
import { User } from "../../entities/user";
import { AppError } from "../../errors";

export default async function softDeleteUserServices(id: string) {
  const userExists = AppDataSource.getRepository(User);

  const findUser = await userExists.findOneBy({
    id,
  });

  if (!findUser) {
    throw new AppError("User not found", 404);
  }

  await userExists.update(id, {
    isActive: false,
  });
}
