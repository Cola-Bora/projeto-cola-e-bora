import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { IUserLogin } from "../../interfaces/user";
import AppDataSource from "../../data-source";
import { User } from "../../entities/user";
import { AppError } from "../../erros";

export default async function loginServices(user: IUserLogin) {
  const dataUser = AppDataSource.getRepository(User);

  const userExists = await dataUser.findOneBy({
    email: user.email,
  });

  if (!userExists) {
    throw new AppError("Invalid user or password", 403);
  }

  const passwordExists = await compare(user.password, userExists.password);

  if (!passwordExists) {
    throw new AppError("Invalid user or password", 403);
  }

  const token = jwt.sign(
    {
      isAdm: userExists.isAdm,
      isActive: userExists.isActive,
    },
    process.env.SECRET_KEY as string,
    {
      expiresIn: "24h",
      subject: userExists.id,
    }
  );

  return token;
}
