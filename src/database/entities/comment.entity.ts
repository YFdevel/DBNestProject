import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import {PostEntity} from "./post.entity";
import {UserEntity} from "./user.entity";

@Entity('comments')
export class CommentEntity {
    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({name: 'text', type: 'text'})
    text: string;

    @Column({name: 'avatar', type: 'text'})
    avatar: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.comments)
    @JoinColumn()
    user: UserEntity;

    @ManyToOne(() => PostEntity, (post) => post.comments)
    @JoinColumn()
    post: PostEntity;

}
