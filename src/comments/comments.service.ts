import {Injectable} from '@nestjs/common';
import {PostsService} from '../posts/posts.service';
import {InjectRepository} from "@nestjs/typeorm";
import {PostEntity} from "../database/entities/post.entity";
import {Repository} from "typeorm";
import {CommentEntity} from "../database/entities/comment.entity";
import {CommentCreateDto} from "../dto/comment-create.dto";
import {UsersService} from "../users/users.service";

@Injectable()
export class CommentsService {
    constructor(@InjectRepository(CommentEntity)
                private readonly commentsRepository: Repository<CommentEntity>,
                private readonly postsService: PostsService,
                private readonly usersService: UsersService) {
    }

    async getComments(): Promise<CommentEntity[]> {
        const comments = await this.commentsRepository.find();
        return comments;
    }

    async getCommentsByPost(id: number): Promise<CommentEntity[]> {
        const _post = await this.postsService.getPost(id);
        let comments = await this.commentsRepository.find({
            where: {
                post: _post
            },
            relations: ['user'],
            join: {
                alias: "comment",
                leftJoinAndSelect: {
                    user: "comment.user"
                }
            }
        });

        return comments;
    }

    async getCommentById(id: number): Promise<CommentEntity> {

        return await this.commentsRepository.findOne({id});
    }

    async getComment(postId: number, commentId: number): Promise<CommentEntity[]> {
        const _post = await this.postsService.getPost(postId);
        let comments = await this.commentsRepository.find({
            where: {
                post: _post,
                id: commentId
            }
        });

        return comments;
    }

    async createComment(data: CommentEntity): Promise<CommentEntity> {
        return this.commentsRepository.save(data);
    }

    async deleteComment(id: number): Promise<CommentEntity[]> {
        const comment = await this.commentsRepository.findOne({
            where: {
                id
            }
        });

        await this.commentsRepository.remove(comment);
        return await this.commentsRepository.find();
    }

    async updateComment(id: number, data: CommentCreateDto): Promise<CommentEntity> {
        let existingComment = await this.commentsRepository.findOne({
            where: {
                id,
            },
        });
        const _user = await this.usersService.findById(data.userId);
        const _post = await this.postsService.getPost(data.postId);
        existingComment.user = _user;
        existingComment.post = _post;
        existingComment.text = data.text;
        existingComment.createdAt = new Date(Date.now());
        if (data.avatar) {
            existingComment.avatar = data.avatar;
        }
        await this.commentsRepository.save(existingComment);
        return existingComment;
    }
}
