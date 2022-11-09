import { Request, Response } from "express";
import { IPaymentRequest } from "../interfaces/payment";
import createPaymentServices from "../services/payment/createPayment.service";
import deletePaymentServices from "../services/payment/deletePayment.service";
import updatePaymentServices from "../services/payment/updatePayment.service";

async function createPaymentControllers(req: Request, res: Response) {
  const id = req.params.id;
  const payment: IPaymentRequest = req.body;
  const newPayment = await createPaymentServices(payment, id);
  return res.status(201).json({ message: newPayment });
}

async function updatePaymentControllers(req: Request, res: Response) {
  const id = req.params.id;
  const payment: IPaymentRequest = req.body;
  const updatePayment = await updatePaymentServices(payment, id);
  return res.status(200).json({ message: updatePayment });
}

async function deletePaymentControllers(req: Request, res: Response) {
  const id = req.params.id;
  const deletePayment = await deletePaymentServices(id);
  return res.status(204).json({ message: deletePayment });
}

export {
  createPaymentControllers,
  updatePaymentControllers,
  deletePaymentControllers,
};
