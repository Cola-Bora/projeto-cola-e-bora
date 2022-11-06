import { UsersEvents } from './../../entities/userEvent';
import AppDataSource from "../../data-source";
import { Ongs } from "../../entities/ong";
import { User } from "../../entities/user";
import { Events } from '../../entities/event';


export default async function deleteOngService(ongId: string, userId: string){
    const ongRepository = AppDataSource.getRepository(Ongs)
    const userRepository = AppDataSource.getRepository(User)
    const eventRepository = AppDataSource.getRepository(Events)

    const ongEvents = await eventRepository.findBy({ong: {id: ongId}})

    ongEvents.forEach(async (event, index) => {
        await eventRepository.delete({ong: {id:ongId}})
    })
    await ongRepository.delete({id: ongId})

    await userRepository.update(userId, {isAdm: false})

    return
}