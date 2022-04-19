import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from "@nestjs/typeorm";
import {PostCreateDto} from '../dto/post.-create.dto';
import * as fs from 'fs';
import {Response} from 'express';
import {MailService} from "../mail/mail.service";
import {PostEntity} from "../database/entities/post.entity";
import {PostUpdateDto} from "../dto/post-update.dto";
import {UsersService} from "../users/users.service";


@Injectable()
export class PostsService {
    constructor(@InjectRepository(PostEntity)
                private readonly postsRepository: Repository<PostEntity>,
                private readonly mailService: MailService,
                private readonly usersService: UsersService) {
    }

    async getPosts(): Promise<PostEntity[]> {
        const posts = this.postsRepository.find();
        return posts;
    }

    async getPost(id: number): Promise<PostEntity | undefined> {
        return this.postsRepository.findOne({
            where: {
                id,
            },
            relations: ['user', 'comments'],
            join: {
                alias: "post",
                leftJoinAndSelect: {
                    posts: "post.user",
                    comments: "post.comments"
                }
            }
        });
    }

    async getPostsByUser(id): Promise<PostEntity[]> {
        const _user = await this.usersService.findById(id);
        const _posts = await this.postsRepository.find({
            where:{
                user:_user
            }
        });

        return _posts;
    }

    async createPost(data: PostEntity): Promise<PostEntity> {
        return this.postsRepository.save(data);
    }

    async updatePost(id: number, data: PostUpdateDto): Promise<PostEntity> {
        let existingPost = await this.postsRepository.findOne({
            where: {
                id,
            },
        });
        const _user = await this.usersService.findById(data.userId);
        existingPost.user = _user;
        existingPost.title = data.title;
        existingPost.description = data.description;
        existingPost.updatedAt = new Date(Date.now());
        await this.postsRepository.save(existingPost);
        await this.mailService.updateLogMessage('yf_dev_test@mail.ru', existingPost);
        return existingPost;
    }


    async deletePost(id: number): Promise<PostEntity[]> {
        const post = await this.postsRepository.findOne({
            where: {
                id,
            },
        });
            await this.postsRepository.remove(post);
            return await this.postsRepository.find();
    }


    async saveFile(path: string, data: Buffer) {
        fs.writeFile(path, data, (error) => {
            if (error) throw new Error(error.message);
        });
    }

    async getFile(response: Response) {
        const buffer = fs.createReadStream('D:/user/blog/text.txt');
        buffer.pipe(response).on('close', () => {
            buffer.destroy();
        });
    }


}






























