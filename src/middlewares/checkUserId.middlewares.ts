import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors";

export default function checkUserIdMiddlewares(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.params.id !== req.user.id) {
    throw new AppError("Unauthorized", 401);
  }

  return next();
}
