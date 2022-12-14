import { Request, Response } from "express";
import { instanceToPlain } from "class-transformer";
import createUserServices from "../services/user/createUser.service";
import updateUserServices from "../services/user/updateUser.service";
import { IUserLogin, IUserRequest } from "../interfaces/user";
import loginServices from "../services/login/login.service";
import softDeleteUserServices from "../services/user/softDeleteUser.service";
import listUsersServices from "../services/user/listUsers.service";
import listOneUserWithEventsServices from "../services/user/listOneUserWithEvents.service";

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
  await softDeleteUserServices(id);
  return res.status(204).send();
}

async function listUsersControllers(req: Request, res: Response) {
  const users = await listUsersServices();
  return res.status(200).json({ data: instanceToPlain(users) });
}

async function listOneUserWithEventsController(req: Request, res: Response){
  const userId = req.params.id
  const user = await listOneUserWithEventsServices(userId)

  return res.status(200).json({data: user})
}

export {
  createUserControllers,
  loginControllers,
  updateUserController,
  softDeleteUserController,
  listUsersControllers,
  listOneUserWithEventsController
};
