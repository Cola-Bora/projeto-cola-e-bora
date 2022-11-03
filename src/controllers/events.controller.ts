import { Request, Response } from "express";

const registerUserEventController = async (req: Request, resp: Response) => {
    const { eventId } = req.params
    const { id } = req.user


};

const deleteUserEventController = async (req: Request, resp: Response) => {

};

const listEventsController = (req: Request, resp: Response) => {

};

export { 
    registerUserEventController,
    deleteUserEventController,
    listEventsController,
};
