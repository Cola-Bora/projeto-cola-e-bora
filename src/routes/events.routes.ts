import { Router } from 'express';
import {
  createEventController,
  deleteUserEventController,
  listEventByIdController,
  listEventsbyOngController,
  listEventsController,
  registerUserEventController,
  updateEventController,
} from '../controllers/events.controller';
import checkAuthUserMiddlewares from "../middlewares/checkAuthUser.middlewares";
import checkIfUserIsOngAdmMiddleware from "../middlewares/checkIfUserIsOngAdm.middleware";

const eventsRoutes = Router();

eventsRoutes.post("/", checkAuthUserMiddlewares, checkIfUserIsOngAdmMiddleware, createEventController);
eventsRoutes.patch("/:eventId", checkAuthUserMiddlewares, checkIfUserIsOngAdmMiddleware, updateEventController);
eventsRoutes.post("/:eventId",checkAuthUserMiddlewares, registerUserEventController)
eventsRoutes.delete("/:eventId", checkAuthUserMiddlewares, deleteUserEventController)
eventsRoutes.get("", listEventsController)
eventsRoutes.get('/:eventId', listEventByIdController);
eventsRoutes.get('/:ongId', listEventsbyOngController);

export default eventsRoutes;