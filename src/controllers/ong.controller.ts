import { IOngRequest, IOngUpdate } from "./../interfaces/ong/index";
import { Request, Response } from "express";
import createOngService from "../services/ong/createOng.services";
import { AppError } from "../errors";
import updateOngService from "../services/ong/updateOng.services";
import { instanceToPlain } from "class-transformer";
import listAllOngsService from "../services/ong/listAllOngs.service";
import listOngByIdService from "../services/ong/listOngById.service";
import listUsersEventOngService from "../services/ong/listUsersEventOng.service";

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

  return res.status(200).json({ data: usersEvent });
}

export {
  createOngController,
  updateOngController,
  listAllOngsController,
  listOngByIdController,
  listUsersEventOngController,
};
