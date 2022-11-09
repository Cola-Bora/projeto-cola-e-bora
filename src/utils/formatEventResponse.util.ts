import { Events } from "../entities/event";
import { IEventResponse } from "../interfaces/event";

const formatEventResponseUtil = (event: Events): IEventResponse => {
    const { id, name, description, address, ong, date } = event;

    const formatedEvent = {
      id,
      name,
      description,
      date: date.toLocaleString(),
      address,
      ong
    }
  
    return formatedEvent;
}

export default formatEventResponseUtil;