import { Router } from "express";
import {
  createOngController,
  listAllOngsController,
  listOngByIdController,
  updateOngController,
} from "../controllers/ong.controller";
import checkAuthUserMiddlewares from "../middlewares/checkAuthUser.middlewares";
import checkIfUserIsOngAdmMiddleware from "../middlewares/checkIfUserIsOngAdm.middleware";
import checkIsAdmOngMiddleware from "../middlewares/checkIsAdmOng.middleware";

const ongsRoutes = Router();

ongsRoutes.post("", checkAuthUserMiddlewares, createOngController);
ongsRoutes.patch(
  "/:ongId",
  checkAuthUserMiddlewares,
  checkIfUserIsOngAdmMiddleware,
  updateOngController
);
ongsRoutes.get("", listAllOngsController);
ongsRoutes.get(
  "/:id",
  checkAuthUserMiddlewares,
  checkIsAdmOngMiddleware,
  listOngByIdController
);

export default ongsRoutes;
