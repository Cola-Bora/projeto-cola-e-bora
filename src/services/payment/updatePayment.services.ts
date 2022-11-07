import { AppError } from "../../errors";
import AppDataSource from "../../data-source";
import { IPaymentRequest } from "../../interfaces/payment";
import { Payment } from "../../entities/payment";
import { User } from "../../entities/user";

export default async function updatePaymentServices(
  pay: IPaymentRequest,
  id: string
) {
  let checkKeys = Object.keys(pay).map(
    item =>
      item.includes("number") ||
      item.includes("securityCode") ||
      item.includes("dueDate")
  );

  if (checkKeys.includes(false)) {
    throw new AppError("Invalid key");
  }

  const dataUser = AppDataSource.getRepository(User);
  const user = await dataUser.findOneBy({ id: id });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const payData = AppDataSource.getRepository(Payment);
  const payment = await payData.find({
    relations: {
      user: true,
    },
  });

  const userPayment = payment.find(paymentTest => paymentTest.user.id === id);

  if (!userPayment) {
    throw new AppError("Payment method does not exist", 404);
  }

  if (pay.dueDate) {
    const newDate = new Date(
      Date.UTC(
        parseInt(pay.dueDate.split("/")[0]),
        parseInt(pay.dueDate.split("/")[1]) - 1,
        parseInt(pay.dueDate.split("/")[2])
      )
    );

    await payData.update(userPayment.id, {
      dueDate: newDate.toISOString(),
    });
  }

  await payData.update(userPayment.id, {
    number: pay.number ? pay.number : userPayment.number,
    securityCode: pay.securityCode
      ? pay.securityCode
      : userPayment.securityCode,
    dueDate: pay.dueDate ? pay.dueDate : userPayment.dueDate,
  });

  return "Payment method successfully edited";
}
