import { hash } from "bcryptjs";
import { IUserRequest } from "../../interfaces/user";
import { AppError } from "../../errors";
import AppDataSource from "../../data-source";
import { User } from "../../entities/user";

export default async function createUserServices(user: IUserRequest) {
  if (Object.keys(user).length !== 4) {
    throw new AppError("Required field is missing");
  }

  let checkKeys = Object.keys(user).map(
    item =>
      item.includes("name") ||
      item.includes("email") ||
      item.includes("password") ||
      item.includes("birthDate")
  );

  if (checkKeys.includes(false)) {
    throw new AppError("Invalid Key");
  }

  const userData = AppDataSource.getRepository(User);

  const users = await userData.find();

  const userExists = users.some(userTest => userTest.email === user.email);

  if (userExists) {
    throw new AppError("This email is already registered", 400);
  }

  const hashPassword = await hash(user.password, 10);

  const newDate = new Date(
    Date.UTC(
      parseInt(user.birthDate.split("/")[0]),
      parseInt(user.birthDate.split("/")[1]) - 1,
      parseInt(user.birthDate.split("/")[2])
    )
  );

  const newUser = userData.create({
    name: user.name,
    email: user.email,
    birthDate: newDate.toISOString(),
    password: hashPassword,
  });

  await userData.save(newUser);

  return newUser;
}
