import {Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, JoinColumn, ManyToOne} from 'typeorm';
import {UserEntity} from './user.entity';

@Entity('sessions')
export class SessionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({unique: true})
    token: string;

    @CreateDateColumn({type: 'timestamp', name: 'createdAt'})
    createdAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.sessions)
    @JoinColumn()
    user: UserEntity;
}
