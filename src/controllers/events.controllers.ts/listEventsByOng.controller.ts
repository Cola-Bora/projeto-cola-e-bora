import { Request, Response } from 'express';
import listEventsByOngService from '../../services/events/listEventsByOng.service';

const listEventsbyOngController = async (req: Request, resp: Response) => {
  const ongId = req.params.id;

  const events = await listEventsByOngService(ongId);

  return resp.status(200).json(events).send();
};

export default listEventsbyOngController;
