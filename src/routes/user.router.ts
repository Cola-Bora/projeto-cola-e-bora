import { Router } from "express";
import { createUserController, getUserByIdController, getUsersController } from "../controllers/user.controllers";

const userRouter = Router();

userRouter.post('/', createUserController);
userRouter.get('/', getUsersController);
userRouter.get('/:id', getUserByIdController);

export default userRouter;