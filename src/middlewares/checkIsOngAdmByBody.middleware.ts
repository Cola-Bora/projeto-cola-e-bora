import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import AppDataSource from "../data-source";
import { Ongs } from "../entities/ong";
import { User } from "../entities/user";
import { AppError } from "../errors";

export default async function checkIsOngAdmByBodyMiddleware(req: Request, res: Response, next: NextFunction){
    const ongRepository = AppDataSource.getRepository(Ongs);
    const userRepository = AppDataSource.getRepository(User);
    const ongId = req.body.ongId;

    if(ongId.length !== 36){
        throw new AppError("Id must have a valid uuid format", 400)
    }

    const user = await userRepository.findOneBy({id: req.user.id})

    const ong = await ongRepository.findOne({
        where: {
            id: ongId
        },
        relations: {
            user: true
        }
    })

    if(!ong){
        throw new AppError("ONG not found", 404)
    }
        
    if(ong.user.id === user!.id){
        return next()
    }

    throw new AppError("Unauthorized", 401)
}