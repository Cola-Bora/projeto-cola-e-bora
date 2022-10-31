import AppDataSource from "../../data-source";
import { User } from "../../entities/userEntity";
import { AppError } from "../../errors/appError";

const getUserByIdService = async (id: string) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.find({
        relations: {
            profile: true
        },
        where: {
            id
        }
    });
    console.log(user);
    if(user.length === 0) {
        throw new AppError(401, 'User not found');
    }
    return user[0];
}

export default getUserByIdService;