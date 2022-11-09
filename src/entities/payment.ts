import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user";

@Entity("paymentInfo")
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ length: 20 })
  number: string;

  @Column({ length: 3 })
  securityCode: string;

  @Column()
  dueDate: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
