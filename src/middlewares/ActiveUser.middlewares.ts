import { Request, Response, NextFunction } from "express";
import AppDataSource from "../data-source";
import { User } from "../entities/user";
import { AppError } from "../errors";

export default async function ActiveUserMiddlewares(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userExists = AppDataSource.getRepository(User);

  const findUser = await userExists.findOneBy({
    email: req.body.email,
  });

  if (!findUser) {
    throw new AppError("Invalid user or password", 403);
  }

  if (findUser?.isActive === false) {
    await userExists.update(findUser.id, {
      isActive: true,
    });
  }

  return next();
}
