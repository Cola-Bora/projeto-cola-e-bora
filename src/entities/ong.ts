import { Exclude } from "class-transformer";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Events } from "./event";
import { Categories } from "./ongCategory";
import { User } from "./user";

class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

@Entity("ongs")
export class Ongs {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 30, unique: true })
  email: string;

  @Column({ length: 15 })
  tel: string;

  @Column({ length: 600 })
  description: string;

  @Column({ length: 14, unique: true })
  cpnj: string;

  @Column({
    type: "numeric",
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  @Exclude()
  balance: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Categories, { eager: true })
  category: Categories;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => Events, events => events.ong, { cascade: true })
  events: Events[];
}
