import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany, Index, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable
} from 'typeorm';
import {PostEntity} from "./post.entity";
import {CommentEntity} from "./comment.entity";
import {IsEmail, IsEnum} from "class-validator";
import {SessionEntity} from "./session.entity";
import {RoleEntity} from "./role.entity";
import {UsersRoles} from "./users_roles.entity";


@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Index()
    @Column({name: 'firstName', type: 'text'})
    firstName: string;

    @Index()
    @Column({name: 'lastName', type: 'text'})
    lastName: string;

    @Column({name: 'email', type: 'text',unique:true})
    @IsEmail()
    email: string;

    @Column({name: 'password', type: 'text'})
    password: string;

    @OneToMany(() => PostEntity, (post) => post.user,{ cascade: true })
    posts: PostEntity[];

    @OneToMany(() => CommentEntity, (comment) => comment.user,{ cascade: true })
    comments: CommentEntity[];

    @OneToMany(() => SessionEntity, session => session.user, { cascade: true })
    sessions: SessionEntity[];

    @ManyToMany(() => RoleEntity,()=>UsersRoles)
    @JoinTable()
    roles: RoleEntity[];

    @CreateDateColumn({type: 'timestamp', name: 'createdAt'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp', name: 'updatedAt'})
    updatedAt: Date;

}
