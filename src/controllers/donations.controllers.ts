import { Request, Response } from "express";
import { IDonation } from "../interfaces/donation";
import createDonationServices from "../services/donations/createDonation.service";

async function createDonationControllers(req: Request, res: Response) {
  const userId: string = req.user.id;
  const ongId: string = req.params.id;
  const donation: IDonation = req.body;
  const newDonation = await createDonationServices(userId, ongId, donation);
  return res.status(201).json({ message: newDonation });
}

export { createDonationControllers };
