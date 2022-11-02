import AppDataSource from "../../data-source";
import { User } from "../../entities/user";
import { AppError } from "../../erros";

export default async function softDeleteUserServices(id: string) {
  const userExists = AppDataSource.getRepository(User);

  const findUser = await userExists.findOneBy({
    id,
  });

  if (!findUser) {
    throw new AppError("User not found", 404);
  }

  if (findUser.isActive === false) {
    throw new AppError("User inative");
  }

  await userExists.update(id, {
    isActive: false,
  });

  return "User successfully deleted";
}
