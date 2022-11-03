import AppDataSource from '../../data-source';
import { Ongs } from '../../entities/ong';
import { AppError } from '../../errors';
import { IOngUpdate } from './../../interfaces/ong/index';


export default async function updateOngService(ongId: string, ongData: IOngUpdate){
    const ongRepository = AppDataSource.getRepository(Ongs)
    
    const ong = await ongRepository.findOneBy({id: ongId})

    if(!ong){
        throw new AppError("Ong not found", 404)
    }

    await ongRepository.update(
        ong.id, 
        {   
            name: ongData.name ? ongData.name : ong.name,
            email: ongData.email ? ongData.email : ong.email,
            tel: ongData.tel ? ongData.tel : ong.tel,
            description: ongData.description ? ongData.description : ong.description,
            cpnj: ongData.cnpj ? ongData.cnpj : ong.cpnj
        })

    const updatedOng = await ongRepository.findOneBy({id: ong.id})
    
    return updatedOng
}

