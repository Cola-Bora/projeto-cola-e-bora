import { Router } from "express";

import {
  createOngController,
  listAllOngsController,
  listOngByIdController,
  listUsersEventOngController,
  updateOngController,
  deleteOngController,
  createEventController,
  updateEventController,
  deleteEventController,
  listUserInOngByIdController,
} from "../controllers/ong.controller";

import checkAuthUserMiddlewares from "../middlewares/checkAuthUser.middlewares";
import checkIfUserIsOngAdmMiddleware from "../middlewares/checkIfUserIsOngAdm.middleware";
import checkIsActiveUserMiddlewares from "../middlewares/checkIsActiveUser.middlewares";
import checkIsAdmOngRequestMiddleware from "../middlewares/checkIsAdmOngRequest.middleware";
import checkIsEventAdmMiddleware from "../middlewares/checkIsEventAdm.middleware";
import checkIsOngAdmByBodyMiddleware from "../middlewares/checkIsOngAdmByBody.middleware";

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
  "/:ongId",
  checkAuthUserMiddlewares,
  checkIsActiveUserMiddlewares,
  checkIsAdmOngRequestMiddleware,
  listOngByIdController
);

ongsRoutes.get(
  "/:ongId/:eventId/users",
  checkAuthUserMiddlewares,
  checkIsActiveUserMiddlewares,
  checkIfUserIsOngAdmMiddleware,
  listUsersEventOngController
);

ongsRoutes.get(
  "/events/:userId",
  checkAuthUserMiddlewares,
  listUserInOngByIdController
);

ongsRoutes.post(
  "/events",
  checkAuthUserMiddlewares,
  checkIsOngAdmByBodyMiddleware,
  createEventController
);

ongsRoutes.patch(
  "/events/:eventId",
  checkAuthUserMiddlewares,
  checkIsEventAdmMiddleware,
  updateEventController
);

ongsRoutes.delete(
  "/events/:eventId",
  checkAuthUserMiddlewares,
  checkIsEventAdmMiddleware,
  deleteEventController
);

export default ongsRoutes;
