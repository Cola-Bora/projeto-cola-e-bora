import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Events } from "./event";
import { User } from "./user";

@Entity("users_events")
export class UsersEvents {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Events)
  event: Events;
}
