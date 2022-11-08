import { Router } from 'express';
import {
  deleteUserEventController,
  listEventByIdController,
  listEventsbyOngController,
  listEventsController,
  listUserInEventByIdController,
  registerUserEventController
} from '../controllers/events.controller';
import checkAuthUserMiddlewares from "../middlewares/checkAuthUser.middlewares";

const eventsRoutes = Router();

eventsRoutes.post("/:eventId",checkAuthUserMiddlewares, registerUserEventController)
eventsRoutes.delete("/:eventId", checkAuthUserMiddlewares, deleteUserEventController)
eventsRoutes.get("", listEventsController)
eventsRoutes.get('/:eventId', listEventByIdController);
eventsRoutes.get('/:ongId', listEventsbyOngController);
eventsRoutes.get('/:eventId/users/:userId', listUserInEventByIdController);

export default eventsRoutes;