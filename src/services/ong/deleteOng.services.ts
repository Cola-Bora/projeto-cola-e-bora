import AppDataSource from "../../data-source";
import { Ongs } from "../../entities/ong";
import { User } from "../../entities/user";


export default async function deleteOngService(ongId: string, userId: string){
    const ongRepository = AppDataSource.getRepository(Ongs)
    const userRepository = AppDataSource.getRepository(User)

    await ongRepository.delete({id: ongId})

    await userRepository.update(userId, {isAdm: false})

    return
}