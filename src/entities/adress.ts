import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Events } from "./event";

@Entity("addresses")
export class Addresses {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ length: 100 })
  street: string;

  @Column({ length: 5 })
  number: string;

  @Column({ length: 8 })
  cep: string;

  @Column({ length: 100 })
  extra: string;
}
