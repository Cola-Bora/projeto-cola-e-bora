import AppDataSource from "../../data-source";
import { User } from "../../entities/user";

export default async function listUsersServices() {
  const listUser = AppDataSource.getRepository(User);

  const users = await listUser.find();

  return users;
}
