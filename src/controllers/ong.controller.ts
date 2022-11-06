import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";
import { AppError } from "../errors";
import createEventService from "../services/events/createEvent.service";
import deleteEventService from "../services/events/deleteEvent.service";
import updateEventService from "../services/events/updateEvent.service";
import createOngService from "../services/ong/createOng.services";
import deleteOngService from "../services/ong/deleteOng.services";
import listAllOngsService from "../services/ong/listAllOngs.service";
import listOngByIdService from "../services/ong/listOngById.service";
import listUsersEventOngService from "../services/ong/listUsersEventOng.service";
import updateOngService from "../services/ong/updateOng.services";
import { IOngRequest } from "./../interfaces/ong/index";

async function createOngController(req: Request, res: Response) {
  if (req.user.isAdm) {
    throw new AppError("User is already linked to a Ong", 400);
  }
  const ong: IOngRequest = req.body;
  const newOng = await createOngService(ong, req.user.id);

  return res.status(201).json({ data: newOng });
}

async function updateOngController(req: Request, res: Response) {
  const ongId = req.params.ongId;
  const ongData = req.body;
  const updatedOng = await updateOngService(ongId, ongData);

  return res.status(200).json({ data: updatedOng });
}

async function listAllOngsController(req: Request, res: Response) {
  const allOngs = await listAllOngsService();

  return res.status(200).json(instanceToPlain({ data: allOngs }));
}

async function listOngByIdController(req: Request, res: Response) {
  const ongId = req.params.ongId;
  const isAdm = req.user.isAdm;
  const OngById = await listOngByIdService(ongId);

  if (isAdm === false) {
    return res.status(200).json(instanceToPlain({ data: OngById }));
  }
  return res.status(200).json({ data: OngById });
}

async function listUsersEventOngController(req: Request, res: Response) {
  const eventId = req.params.eventId;
  const usersEvent = await listUsersEventOngService(eventId);

  return res.status(200).json(instanceToPlain({ data: usersEvent }));
}

async function deleteOngController(req: Request, res: Response) {
  const ongId = req.params.ongId;

  deleteOngService(ongId, req.user.id);

  return res.status(204).send();
}

const createEventController = async (req: Request, res: Response) => {
  const event = await createEventService(req.body);
  return res.status(201).json({ data: instanceToPlain(event) });
};

const updateEventController = async (req: Request, res: Response) => {
  const event = await updateEventService(req.params.eventId, req.body);
  return res.status(201).json({ data: instanceToPlain(event) });
};

const deleteEventController = async (req: Request, res: Response) => {
  const event = await deleteEventService(req.params.eventId);
  return res.status(204).send();
};

export {
  createOngController,
  updateOngController,
  deleteOngController,
  listAllOngsController,
  listOngByIdController,
  listUsersEventOngController,
  createEventController,
  updateEventController,
  deleteEventController
};

