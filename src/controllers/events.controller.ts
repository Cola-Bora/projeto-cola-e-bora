import { instanceToPlain } from "class-transformer";
import { Request, Response } from 'express';
import createEventService from "../services/event/createEvent.service";
import listEventsService from '../services/events/listEvents.service';
import listEventByIdService from '../services/events/listEventById.service';
import listEventsByOngService from '../services/events/listEventsByOng.service';
import deleteUserEventService from '../services/events/deleteUserEvent.service';
import registerUserEventService from '../services/events/registerUserEvent.service';

const createEventController = async (req: Request, res: Response) => {
    const event = await createEventService(req.body);
    return res.status(201).json({ data: instanceToPlain(event) });
};

const registerUserEventController = async (req: Request, resp: Response) => {
  const { eventId } = req.params;
  const { id } = req.user;

  const userEventsResponse: string = await registerUserEventService(
    eventId,
    id
  );

  return resp.status(201).json({ message: userEventsResponse }).send();
};

const deleteUserEventController = async (req: Request, resp: Response) => {
  const { eventId } = req.params;
  const { id } = req.user;

  await deleteUserEventService(eventId, id);

  return resp.status(204).send();
};

const listEventsController = async (req: Request, resp: Response) => {
  const events = await listEventsService();

  return resp.status(200).json({ data: events }).send();
};

const listEventsbyOngController = async (req: Request, resp: Response) => {
  const ongId = req.params.id;
  const events = await listEventsByOngService(ongId);
  return resp.status(200).json(events).send();
};

const listEventByIdController = async (req: Request, resp: Response) => {
  const eventId = req.params.id;
  const event = await listEventByIdService(eventId);
  return resp.status(200).json(event).send();
};

export {
  createEventController,
  registerUserEventController,
  deleteUserEventController,
  listEventByIdController,
  listEventsbyOngController,
  listEventsController,
};
