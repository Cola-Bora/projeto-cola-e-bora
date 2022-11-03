import { Router } from "express";
import { deleteUserEventController, listEventsController, registerUserEventController } from "../controllers/events.controller";
import checkAuthUserMiddlewares from "../middlewares/checkAuthUser.middlewares";

const eventsRoutes = Router()

eventsRoutes.post("/:eventId",checkAuthUserMiddlewares, registerUserEventController)
eventsRoutes.delete("/:eventId", checkAuthUserMiddlewares, deleteUserEventController)
eventsRoutes.get("", listEventsController)

export default eventsRoutes