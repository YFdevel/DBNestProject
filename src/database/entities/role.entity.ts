import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Index,
    UpdateDateColumn,
    CreateDateColumn,
    ManyToMany,
    JoinTable
} from 'typeorm';
import {UserEntity} from "./user.entity";
import {UsersRoles} from "./users_roles.entity";

@Entity('roles')
export class RoleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ name: 'value', type: 'text',unique: true })
    value: string;

    @Column({ name: 'description', type: 'text'})
    description: string;

    @CreateDateColumn({ type: 'timestamp', name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updatedAt' })
    updatedAt: Date;

    @ManyToMany(() => UserEntity,()=>UsersRoles)
    @JoinTable()
    users: UserEntity[];
}
