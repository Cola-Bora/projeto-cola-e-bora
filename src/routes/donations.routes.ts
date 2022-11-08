import { Router } from "express";
import { createDonationControllers } from "../controllers/donations.controllers";
import checkAuthUserMiddlewares from "../middlewares/checkAuthUser.middlewares";
import checkIsActiveUserMiddlewares from "../middlewares/checkIsActiveUser.middlewares";

const donationRoutes = Router();

donationRoutes.post(
  "/:id",
  checkAuthUserMiddlewares,
  checkIsActiveUserMiddlewares,
  createDonationControllers
);

export default donationRoutes;
