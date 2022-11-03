import { Request, Response, NextFunction } from "express";
import AppDataSource from "../data-source";
import { User } from "../entities/user";
import { AppError } from "../errors";

export default async function checkIsActiveUserMiddlewares(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userExists = AppDataSource.getRepository(User);

  const findUser = await userExists.findOneBy({
    id: req.user.id,
  });

  if (!findUser) {
    throw new AppError("User not found", 404);
  }

  if (findUser.isActive === false) {
    throw new AppError("User inative");
  }

  return next();
}
