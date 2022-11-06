import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import AppDataSource from "../data-source";
import { Events } from "../entities/event";
import { Ongs } from "../entities/ong";
import { User } from "../entities/user";
import { AppError } from "../errors";

export default async function checkIsEventAdmMiddleware(req: Request, res: Response, next: NextFunction){
    const userRepository = AppDataSource.getRepository(User);
    const eventRepository = AppDataSource.getRepository(Events);
    const ongRepository = AppDataSource.getRepository(Ongs);

    const userId = req.user.id;
    const eventId = req.params.eventId;

    if(eventId.length !== 36){
        throw new AppError("Id must have a valid uuid format", 400)
    }

    const user = await userRepository.findOneBy({
        id: userId
    });

    const event = await eventRepository.findOne({
        where: {
            id: eventId
        },
        relations: {
            ong: true
        }
    });

    if(!event){
        throw new AppError("Event not found", 404)
    };

    const ong = await ongRepository.findOne({
        where: {
            id: event!.ong.id
        },
        relations: {
            user: true
        }
    });

    if(!ong){
        throw new AppError("ONG not found", 404)
    };
        
    if(ong.user.id === user!.id){
        return next()
    };

    throw new AppError("Unauthorized", 401);
}