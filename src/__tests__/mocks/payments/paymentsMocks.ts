import { IPaymentRequest } from "../../../interfaces/payment";

export const mockedInvalidRequestBodyPayment: any = {
  number: "5593889718264334",
  securityCode: "407",
  dueDate: "2024/08/01",
  userId: "5593889718264334",
};

export const mockedInvalidKeyPayment: any = {
  number: "5593889718264334",
  securityCode: "407",
  dueDat: "2024/08/01",
};

export const mockedPayment: IPaymentRequest = {
  number: "5593889718264334",
  securityCode: "407",
  dueDate: "2024/08/01",
};
