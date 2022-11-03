import { Router } from "express";
import { deleteUserEventController, listEventsController, registerUserEventController } from "../controllers/events.controller";

const eventsRoutes = Router()

eventsRoutes.post("/eventId", registerUserEventController)
eventsRoutes.delete("/eventId", deleteUserEventController)
eventsRoutes.get("", listEventsController)

export default eventsRoutes