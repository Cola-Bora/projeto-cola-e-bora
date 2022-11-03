import { Request, Response, NextFunction } from "express";
import AppDataSource from "../data-source";
import { User } from "../entities/user";

export default async function checkIsAdmOngRequestMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userRepository = AppDataSource.getRepository(User);

  const findUser = await userRepository.findOneBy({
    id: req.user.id,
  });

  req.user.isAdm = findUser?.isAdm!;
  return next();
}
