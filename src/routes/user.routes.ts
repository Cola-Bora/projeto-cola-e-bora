import { Router } from "express";
import {
  createUserControllers,
  listUsersControllers,
  softDeleteUserController,
  updateUserController,
} from "../controllers/user.controllers";
import checkAuthUserMiddlewares from "../middlewares/checkAuthUser.middlewares";
import checkIsActiveUserMiddlewares from "../middlewares/checkIsActiveUser.middlewares";
import checkUserIdMiddlewares from "../middlewares/checkUserId.middlewares";

const userRoutes = Router();

userRoutes.post("", createUserControllers);
userRoutes.patch(
  "/:id",
  checkAuthUserMiddlewares,
  checkIsActiveUserMiddlewares,
  checkUserIdMiddlewares,
  updateUserController
);
userRoutes.delete(
  "/:id",
  checkAuthUserMiddlewares,
  checkIsActiveUserMiddlewares,
  checkUserIdMiddlewares,
  softDeleteUserController
);
userRoutes.get("", checkAuthUserMiddlewares, listUsersControllers);
export default userRoutes;
