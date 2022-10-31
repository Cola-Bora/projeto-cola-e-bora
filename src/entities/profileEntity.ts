import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./userEntity";

@Entity('profiles')
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn()
    birthDate: Date

    @Column()
    country: string

    @OneToOne(() => User, (user) => user.profile)
    user: User
}