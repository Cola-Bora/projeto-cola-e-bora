import { Router } from "express";
import {
  createUserControllers,
  listUsersControllers,
  softDeleteUserController,
  updateUserController,
} from "../controllers/user.controllers";
import checkAuthUserMiddlewares from "../middlewares/checkAuthUser.middlewares";

const userRoutes = Router();

userRoutes.post("", createUserControllers);
userRoutes.patch("/:id", checkAuthUserMiddlewares, updateUserController);
userRoutes.get("", checkAuthUserMiddlewares, listUsersControllers);
userRoutes.delete("/:id", checkAuthUserMiddlewares, softDeleteUserController);
export default userRoutes;
