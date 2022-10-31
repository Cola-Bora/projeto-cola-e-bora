import AppDataSource from "../../data-source";
import { User } from "../../entities/userEntity";

const getUsersService = async () => {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({ relations: { profile: true } });
    return users;
}

export default getUsersService;