import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Addresses } from "./adress";
import { Ongs } from "./ong";

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
}
