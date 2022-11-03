import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import { AppError } from "../errors";
import AppDataSource from "../data-source";
import { Ongs } from "../entities/ong";
import { User } from "../entities/user";

export default async function checkIfUserIsOngAdmMiddleware(req: Request, res: Response, next: NextFunction){
    const ongId = req.params.ongId
    const ongRepository = AppDataSource.getRepository(Ongs)
    const userRepository = AppDataSource.getRepository(User)

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
        throw new AppError("Ong not found", 404)
    }
        
    if(ong.user.id === user!.id){
        return next()
    }

    throw new AppError("Unauthorized", 200)
}