import { Router } from 'express';
import {
  createEventController,
  deleteEventController,
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

eventsRoutes.post("/ongs", checkAuthUserMiddlewares, checkIfUserIsOngAdmMiddleware, createEventController);
eventsRoutes.patch("/ongs/:eventId", checkAuthUserMiddlewares, checkIfUserIsOngAdmMiddleware, updateEventController);
eventsRoutes.delete('/ongs/:eventId', checkAuthUserMiddlewares, checkIfUserIsOngAdmMiddleware, deleteEventController);
eventsRoutes.post("/:eventId",checkAuthUserMiddlewares, registerUserEventController)
eventsRoutes.delete("/:eventId", checkAuthUserMiddlewares, deleteUserEventController)
eventsRoutes.get("", listEventsController)
eventsRoutes.get('/:eventId', listEventByIdController);
eventsRoutes.get('/:ongId', listEventsbyOngController);

export default eventsRoutes;