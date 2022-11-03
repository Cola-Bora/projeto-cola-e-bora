import { IOngRequest, IOngUpdate } from './../interfaces/ong/index';
import { Request, Response } from "express";
import createOngService from '../services/ong/createOng.services';
import { AppError } from '../errors';
import updateOngService from '../services/ong/updateOng.services';


async function createOngController(req: Request, res: Response){
    if(req.user.isAdm){
        throw new AppError("User is already linked to a Ong", 400)
    }
    const ong: IOngRequest = req.body;
    const newOng = await createOngService(ong, req.user.id)

    return res.status(201).json({data: newOng})
}


async function updateOngController(req: Request, res: Response){
    const ongId = req.params.ongId
    const ongData = req.body
    const updatedOng = await updateOngService(ongId, ongData)

    return res.status(200).json({data: updatedOng})
}

export {createOngController, updateOngController}