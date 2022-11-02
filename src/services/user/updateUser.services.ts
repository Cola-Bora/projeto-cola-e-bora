import { hash } from "bcryptjs";
import { Request } from "express";
import AppDataSource from "../../data-source";
import { User } from "../../entities/user";
import { AppError } from "../../errors";
import { IUserUpdate } from "../../interfaces/user";

export default async function updateUserServices(
  dataUser: IUserUpdate,
  id: string,
  userDecoded: Request["user"]
) {
  if (id.length !== 36) {
    throw new AppError("Invalid Id");
  }

  const userExists = AppDataSource.getRepository(User);

  const findUser = await userExists.findOneBy({
    id,
  });

  if (!findUser) {
    throw new AppError("User not found", 404);
  }

  if (id !== userDecoded.id) {
    throw new AppError("Unauthorized", 401);
  }

  await userExists.update(userDecoded.id, {
    name: dataUser.name ? dataUser.name : findUser.name,
    email: dataUser.email ? dataUser.email : findUser.email,
    age: dataUser.age ? dataUser.age : findUser.age,
    password: dataUser.password
      ? await hash(dataUser.password, 10)
      : findUser.password,
  });

  const user = await userExists.findOneBy({
    id,
  });

  return user!;
}
