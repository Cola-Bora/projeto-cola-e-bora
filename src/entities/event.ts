import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Addresses } from "./adress";
import { Ongs } from "./ong";
import { UsersEvents } from "./userEvent";

@Entity("events")
export class Events {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column()
  date: Date;

  @Column({ length: 600 })
  description: string;

  @ManyToOne(() => Addresses)
  address: Addresses;

  @ManyToOne(() => Ongs)
  ong: Ongs;

  @OneToMany(() =>  UsersEvents, userEvents => userEvents.user)
  userEvents: UsersEvents[]

}
