import { Request, Response } from "express";
import { AppError, handleError } from "../errors/appError";
import createUserService from "../services/users/createUser.service";
import getUserByIdService from "../services/users/getUserById.service";
import getUsersService from "../services/users/getUsers.service";

const createUserController = async (req: Request, res: Response) => {
  const newUser = await createUserService(req.body);
  return res.status(201).json(newUser);
};

const getUsersController = async (req: Request, res: Response) => {
  const users = await getUsersService();
  return res.json(users);
};

const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const user = await getUserByIdService(req.params.id);
    return res.json(user);
  } catch (error) {
    if (error instanceof AppError) {
      handleError(error, res);
    }
    return res.status(500).send();
  }
};

export { createUserController, getUsersController, getUserByIdController };
