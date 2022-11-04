import { User } from '../../entities/user';
import AppDataSource from '../../data-source';
import { Ongs } from '../../entities/ong';
import { IOngRequest } from '../../interfaces/ong/index';
import { Categories } from '../../entities/ongCategory';
import { AppError } from '../../errors';
import { instanceToPlain } from "class-transformer"


export default async function createOngService(ong: IOngRequest, userId: string){
    if (Object.keys(ong).length < 6) {
        throw new AppError("Required field is missing");
    }

    const ongRepository = AppDataSource.getRepository(Ongs)
    const userRepository = AppDataSource.getRepository(User)
    const categoryRepository = AppDataSource.getRepository(Categories)

    const category = await categoryRepository.findOneBy({id: ong.categoryId})
    const user = await userRepository.findOneBy({id: userId})
    
    if(!category){
        throw new AppError("Category does not exist in database", 404)
    }

    const ongAlreadyExists = await ongRepository.find({
        where: {
            cpnj: ong.cnpj,
            email: ong.email
        }
    })

    if(ongAlreadyExists.length > 0){
        throw new AppError("Email/Cnpj is already being used")
    }

    const newOng = ongRepository.create({
        name:ong.name,
        email: ong.email,
        tel: ong.tel,
        description: ong.description,
        cpnj: ong.cnpj,
        category: category,
        user: user!
    })

    await ongRepository.save(newOng)

    await userRepository.update(userId, {isAdm: true})

    const updatedNewOng = await ongRepository.findOneBy({id: newOng.id})

    return updatedNewOng
}


