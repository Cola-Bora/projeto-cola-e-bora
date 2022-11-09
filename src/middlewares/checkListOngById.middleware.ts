import { Request, Response, NextFunction } from "express";
import AppDataSource from "../data-source";
import { Ongs } from "../entities/ong";
import { User } from "../entities/user";
import { AppError } from "../errors";

export default async function checkListOngByIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ongId = req.params.ongId;
  const ongRepository = AppDataSource.getRepository(Ongs);
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOneBy({ id: req.user.id });

  const ong = await ongRepository.findOne({
    where: {
      id: ongId,
    },
    relations: {
      user: true,
    },
  });

  if (req.user.isAdm === false) {
    return next();
  }
  if (ong!.user.id === user!.id) {
    return next();
  }
  throw new AppError("Unauthorized", 401);
}
