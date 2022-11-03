import { Request, Response } from 'express';
import listEventByIdService from '../services/events/listEventById.service';
import listEventsByOngService from '../services/events/listEventsByOng.service';

const registerUserEventController = async (req: Request, resp: Response) => {};

const deleteUserEventController = async (req: Request, resp: Response) => {};

const listEventByIdController = async (req: Request, resp: Response) => {
  const eventId = req.params.id;
  const event = await listEventByIdService(eventId);
  return resp.status(200).json(event).send();
};

const listEventsbyOngController = async (req: Request, resp: Response) => {
  const ongId = req.params.id;
  const events = await listEventsByOngService(ongId);
  return resp.status(200).json(events).send();
};

export {
  registerUserEventController,
  deleteUserEventController,
  listEventByIdController,
  listEventsbyOngController,
};
