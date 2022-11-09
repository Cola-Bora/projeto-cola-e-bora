import { instanceToPlain } from "class-transformer";
import AppDataSource from "../../data-source";
import { User } from "../../entities/user";


export default async function listOneUserWithEventsServices(id: string) {
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOne({
      where: {id: id},
      relations: {userEvents: true}
    }
  );

  return instanceToPlain(user);
}
