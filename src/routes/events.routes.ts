import { Router } from 'express';
import {
  deleteUserEventController,
  listEventByIdController,
  listEventsbyOngController,
  registerUserEventController,
} from '../controllers/events.controller';

const eventsRoutes = Router();

eventsRoutes.post('/:eventId', registerUserEventController);
eventsRoutes.delete('/:eventId', deleteUserEventController);
eventsRoutes.get('/:eventId', listEventByIdController);
eventsRoutes.get('/:ongId', listEventsbyOngController);

export default eventsRoutes;
