import { Router } from "express";
import { createEventController } from "../controllers/events.controller";
import checkAuthUserMiddlewares from "../middlewares/checkAuthUser.middlewares";
import checkIfUserIsOngAdmMiddleware from "../middlewares/checkIfUserIsOngAdm.middleware";

const eventsRoutes = Router()

eventsRoutes.post("/", checkAuthUserMiddlewares, checkIfUserIsOngAdmMiddleware, createEventController);

export default eventsRoutes