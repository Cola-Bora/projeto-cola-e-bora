import { Request, Response } from "express";
import { instanceToPlain } from "class-transformer";
import createUserServices from "../services/user/createUser.services";
import updateUserServices from "../services/user/updateUser.services";
import { IUserLogin, IUserRequest } from "../interfaces/user";
import loginServices from "../services/login/login.services";
import softDeleteUserServices from "../services/user/softDeleteUser.services";

async function createUserControllers(req: Request, res: Response) {
  const user: IUserRequest = req.body;
  const newUser = await createUserServices(user);
  return res.status(201).json({ data: instanceToPlain(newUser) });
}

async function loginControllers(req: Request, res: Response) {
  const user: IUserLogin = req.body;
  const token = await loginServices(user);
  return res.status(200).json({ token: token });
}

async function updateUserController(req: Request, res: Response) {
  const dataUser = req.body;
  const id = req.params.id;
  const userDecoded = req.user;
  const updateUser = await updateUserServices(dataUser, id, userDecoded);
  return res.status(200).json({ data: instanceToPlain(updateUser) });
}

async function softDeleteUserController(req: Request, res: Response) {
  const id = req.params.id;
  const deleteUser = await softDeleteUserServices(id);
  return res.status(204).json({ message: deleteUser });
}

export {
  createUserControllers,
  loginControllers,
  updateUserController,
  softDeleteUserController,
};
