import { Request, Response } from "express";
import listEventsByOngService from "../services/events/listEventsByOng.service";

const registerUserEventController = async (req: Request, resp: Response) => {

};

const deleteUserEventController = async (req: Request, resp: Response) => {

};

const listEventsController = (req: Request, resp: Response) => {

};



const listEventsbyOngController = async (req: Request, resp: Response) => {
  const ongId = req.params.id;
  const events = await listEventsByOngService(ongId);
  return resp.status(200).json(events).send();
};



export { 
    registerUserEventController,
    deleteUserEventController,
    listEventsController,
    listEventsbyOngController,
};
