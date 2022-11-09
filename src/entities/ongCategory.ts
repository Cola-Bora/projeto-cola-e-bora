import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("ongCategory")
export class Categories {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ unique: true })
  name: string;
}
