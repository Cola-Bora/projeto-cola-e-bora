import { Router } from "express";

import {
  createOngController,
  listAllOngsController,
  listOngByIdController,
  listUsersEventOngController,
  updateOngController,
  deleteOngController,
} from "../controllers/ong.controller";

import checkAuthUserMiddlewares from "../middlewares/checkAuthUser.middlewares";
import checkIfUserIsOngAdmMiddleware from "../middlewares/checkIfUserIsOngAdm.middleware";
import checkIsAdmOngRequestMiddleware from "../middlewares/checkIsAdmOngRequest.middleware";

const ongsRoutes = Router();

ongsRoutes.post("", checkAuthUserMiddlewares, createOngController);
ongsRoutes.patch(
  "/:ongId",
  checkAuthUserMiddlewares,
  checkIfUserIsOngAdmMiddleware,
  updateOngController
);
ongsRoutes.delete(
  "/:ongId",
  checkAuthUserMiddlewares,
  checkIfUserIsOngAdmMiddleware,
  deleteOngController
);

ongsRoutes.get("", listAllOngsController);

ongsRoutes.get(
  "/:id",
  checkAuthUserMiddlewares,
  checkIsAdmOngRequestMiddleware,
  listOngByIdController
);

ongsRoutes.get(
  "/:ongId/:eventId/users",
  checkAuthUserMiddlewares,
  checkIfUserIsOngAdmMiddleware,
  listUsersEventOngController
);

export default ongsRoutes;
