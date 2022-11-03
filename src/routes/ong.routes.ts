import { Router } from "express";
import {
  createOngController,
  listAllOngsController,
  updateOngController,
} from "../controllers/ong.controller";
import checkAuthUserMiddlewares from "../middlewares/checkAuthUser.middlewares";
import checkIfUserIsOngAdmMiddleware from "../middlewares/checkIfUserIsOngAdm.middleware";

const ongsRoutes = Router();

ongsRoutes.post("", checkAuthUserMiddlewares, createOngController);
ongsRoutes.patch(
  "/:ongId",
  checkAuthUserMiddlewares,
  checkIfUserIsOngAdmMiddleware,
  updateOngController
);
ongsRoutes.get("", listAllOngsController);

export default ongsRoutes;
