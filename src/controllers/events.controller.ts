import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";
import createEventService from "../services/event/createEvent.service";

const createEventController = async (req: Request, res: Response) => {
    const event = await createEventService(req.body);
    return res.status(201).json({ data: instanceToPlain(event) });
};

export { 
    createEventController
};
