import { AppError } from "../../errors";
import AppDataSource from "../../data-source";
import { IPaymentRequest } from "../../interfaces/payment";
import { Payment } from "../../entities/payment";
import { User } from "../../entities/user";

export default async function createPaymentServices(
  pay: IPaymentRequest,
  id: string
) {
  if (Object.keys(pay).length !== 3) {
    throw new AppError("Required field is missing");
  }

  let checkKeys = Object.keys(pay).map(
    item =>
      item.includes("number") ||
      item.includes("securityCode") ||
      item.includes("dueDate")
  );

  if (checkKeys.includes(false)) {
    throw new AppError("Invalid key");
  }

  const payData = AppDataSource.getRepository(Payment);
  const payment = await payData.find();
  const payExists = payment.some(payTest => payTest.number === pay.number);

  if (payExists) {
    throw new AppError("This card is already being used");
  }

  const userCard = payment.some( payment => payment.user.id === id)

  if (userCard) {
    throw new AppError("User already has a payment method");
  }

  const dataUser = AppDataSource.getRepository(User);
  const user = await dataUser.findOneBy({ id: id });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const newDate = new Date(
    Date.UTC(
      parseInt(pay.dueDate.split("/")[0]),
      parseInt(pay.dueDate.split("/")[1]) - 1,
      parseInt(pay.dueDate.split("/")[2])
    )
  );

  const newPayment = payData.create({
    number: pay.number,
    securityCode: pay.securityCode,
    dueDate: newDate.toISOString(),
    user: user,
  });

  await payData.save(newPayment);

  return "Credit card successfully created";
}
