import { Router } from "express";
import {
  createPaymentControllers,
  deletePaymentControllers,
  updatePaymentControllers,
} from "../controllers/payment.controllers";
import checkAuthUserMiddlewares from "../middlewares/checkAuthUser.middlewares";
import checkIsActiveUserMiddlewares from "../middlewares/checkIsActiveUser.middlewares";
import checkUserIdMiddlewares from "../middlewares/checkUserId.middlewares";

const paymentsRoutes = Router();

paymentsRoutes.post(
  "/:id",
  checkAuthUserMiddlewares,
  checkIsActiveUserMiddlewares,
  checkUserIdMiddlewares,
  createPaymentControllers
);

paymentsRoutes.patch(
  "/:id",
  checkAuthUserMiddlewares,
  checkIsActiveUserMiddlewares,
  checkUserIdMiddlewares,
  updatePaymentControllers
);

paymentsRoutes.delete(
  "/:id",
  checkAuthUserMiddlewares,
  checkIsActiveUserMiddlewares,
  checkUserIdMiddlewares,
  deletePaymentControllers
);

export default paymentsRoutes;
