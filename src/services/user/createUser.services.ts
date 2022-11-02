import { hash } from "bcryptjs";
import { IUserRequest } from "../../interfaces/user";
import { AppError } from "../../erros";
import AppDataSource from "../../data-source";
import { User } from "../../entities/user";

export default async function createUserServices(user: IUserRequest) {
  if (Object.keys(user).length !== 5) {
    throw new AppError("Required field is missing");
  }

  const userData = AppDataSource.getRepository(User);

  const users = await userData.find();

  const userExists = users.some(userTest => userTest.email === user.email);

  if (userExists) {
    throw new AppError("This email is already registered", 400);
  }

  const hashPassword = await hash(user.password, 10);

  const newUser = userData.create({
    name: user.name,
    email: user.email,
    age: user.age,
    isAdm: user.isAdm,
    password: hashPassword,
  });

  await userData.save(newUser);

  return newUser;
}
