import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import deleteUserEventService from '../services/events/deleteUserEvent.service';
import listEventByIdService from '../services/events/listEventById.service';
import listEventsService from '../services/events/listEvents.service';
import listEventsByOngService from '../services/events/listEventsByOng.service';
import registerUserEventService from '../services/events/registerUserEvent.service';

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

  return resp
    .status(200)
    .json({ data: instanceToPlain(events) })
    .send();
};

const listEventsbyOngController = async (req: Request, resp: Response) => {
  const ongId = req.params.ongId;
  const events = await listEventsByOngService(ongId);
  return resp.status(200).json({ data: events }).send();
};

const listEventByIdController = async (req: Request, resp: Response) => {
  const eventId = req.params.eventId;
  const event = await listEventByIdService(eventId);
  return resp.status(200).json({ data: event }).send();
};

export {
  registerUserEventController,
  deleteUserEventController,
  listEventByIdController,
  listEventsbyOngController,
  listEventsController,
};
