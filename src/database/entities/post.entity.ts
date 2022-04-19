import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    ManyToOne,
    OneToMany, JoinColumn
} from 'typeorm';
import {CommentEntity} from './comment.entity';
import {UserEntity} from "./user.entity";


@Entity('posts')
export class PostEntity {

    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({name: 'title', type: 'text'})
    title: string;

    @Column({name: 'description', type: 'text'})
    description: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.posts)
    @JoinColumn()
    user: UserEntity;

    @OneToMany(() => CommentEntity, (comment) => comment.post,{ cascade: true })
    comments: CommentEntity[];
}
