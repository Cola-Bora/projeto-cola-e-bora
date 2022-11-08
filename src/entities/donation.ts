import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Ongs } from "./ong";
import { User } from "./user";

@Entity("donations")
export class Donations {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  value: number;

  @Column()
  date: Date;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Ongs)
  ong: Ongs;
}
