import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { AppError } from "../errors";

export default function checkAuthUserMiddlewares(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token = req.headers.authorization;

  if (!token) {
    throw new AppError("Invalid token", 401);
  }

  token = token.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY as string, (error, decoded: any) => {
    if (error) {
      throw new AppError("Invalid token", 401);
    }

    req.user = {
      isAdm: decoded.isAdm,
      isActive: decoded.isActive,
      id: decoded.sub,
    };

    return next();
  });
}
