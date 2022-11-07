import { Router } from 'express';
import {
  deleteUserEventController,
  listEventByIdController,
  listEventsbyOngController,
  listEventsController,
  registerUserEventController,
} from '../controllers/events.controller';
import checkAuthUserMiddlewares from '../middlewares/checkAuthUser.middlewares';

const eventsRoutes = Router();

eventsRoutes.post(
  '/:eventId',
  checkAuthUserMiddlewares,
  registerUserEventController
);
eventsRoutes.delete(
  '/:eventId',
  checkAuthUserMiddlewares,
  deleteUserEventController
);
eventsRoutes.get('', listEventsController);

eventsRoutes.get('/:eventId', listEventByIdController);
eventsRoutes.get('/ongs/:ongId', listEventsbyOngController);

export default eventsRoutes;
