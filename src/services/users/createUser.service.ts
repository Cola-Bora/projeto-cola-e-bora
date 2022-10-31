import AppDataSource from "../../data-source";
import { Profile } from "../../entities/profileEntity";
import { User } from "../../entities/userEntity";
import { IUserRequest } from "../../interfaces/userInterfaces";

const createUserService = async ({name, profile}: IUserRequest) => {
    const userRepository = AppDataSource.getRepository(User);
    const profileRepository = AppDataSource.getRepository(Profile);

    const newProfile = await profileRepository.save({
        birthDate: new Date(profile.birthDate),
        country: profile.country
    });

    const newUser = await userRepository.save({
        name,
        profile: newProfile
    });

    return newUser;
}

export default createUserService;