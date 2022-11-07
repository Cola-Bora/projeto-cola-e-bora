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
  let checkKeys = Object.keys(dataUser).map(
    item =>
      item.includes("name") ||
      item.includes("email") ||
      item.includes("password") ||
      item.includes("birthDate")
  );

  if (checkKeys.includes(false)) {
    throw new AppError("Invalid key");
  }

  const userExists = AppDataSource.getRepository(User);

  const findUser = await userExists.findOneBy({
    id,
  });

  if (!findUser) {
    throw new AppError("User not found", 404);
  }

  if (dataUser.birthDate) {
    const newDate = new Date(
      Date.UTC(
        parseInt(dataUser.birthDate.split("/")[0]),
        parseInt(dataUser.birthDate.split("/")[1]) - 1,
        parseInt(dataUser.birthDate.split("/")[2])
      )
    );

    await userExists.update(userDecoded.id, {
      birthDate: newDate.toISOString(),
    });
  }

  await userExists.update(userDecoded.id, {
    name: dataUser.name ? dataUser.name : findUser.name,
    email: dataUser.email ? dataUser.email : findUser.email,
    password: dataUser.password
      ? await hash(dataUser.password, 10)
      : findUser.password,
  });

  const user = await userExists.findOneBy({
    id,
  });

  return user!;
}
