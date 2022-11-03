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
} from 'typeorm';
import { Events } from './event';
import { Categories } from './ongCategory';
import { User } from './user';

@Entity('ongs')
export class Ongs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  balance: number;

  @Column({ type: 'int' })
  age: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Categories)
  category: Categories[];

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => Events, (events) => events.ong)
  events: Events[];
}
