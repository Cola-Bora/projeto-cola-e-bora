import AppDataSource from "../../data-source";
import { Events } from "../../entities/event";
import { User } from "../../entities/user";
import { UsersEvents } from "../../entities/userEvent";
import { AppError } from "../../errors";

const registerUserEventService = async (eventId: string, id: string): Promise<string> => {
  const eventRepository = AppDataSource.getRepository(Events);
  const userRepository = AppDataSource.getRepository(User);
  const userEventRepository = AppDataSource.getRepository(UsersEvents)

  if (eventId.length !== 36) throw new AppError("Invalid Id");

  const event : Events | null = await eventRepository.findOneBy({
    id: eventId,
  });

  const user = await userRepository.findOneBy({
    id: id
  })

  if (!event) throw new AppError("Event not found", 404);
  if (!user) throw new AppError("User not found", 404);


  const confirmEvent = userEventRepository.create({
    user: user,
    event: event,
  })

  await userEventRepository.save(confirmEvent)

  return "User successfully registered on event."
};

export default registerUserEventService;
