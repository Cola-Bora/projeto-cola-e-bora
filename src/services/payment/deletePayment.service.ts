import AppDataSource from "../../data-source";
import { Payment } from "../../entities/payment";
import { AppError } from "../../errors";

export default async function deletePaymentServices(id: string) {
  const dataPayment = AppDataSource.getRepository(Payment);

  const payment = await dataPayment.find({
    relations: {
      user: true,
    },
  });

  const pay = payment.find(payTeste => payTeste.user.id === id);

  if (!pay) {
    throw new AppError("Payment method does not exist", 404);
  }

  await dataPayment.delete(pay.id);

  return "Payment method deleted successfully";
}
