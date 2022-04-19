import {
    Body,
    Controller,
    Delete,
    Get, HttpException, HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Render,
    Res, UseGuards
} from '@nestjs/common';
import {PostsService} from './posts.service';
import {PostEntity} from "../database/entities/post.entity";
import {ParamIdDto} from '../dto/param-id.dto';
import {join} from 'path';
import {Response} from 'express';
import {createReadStream} from 'fs';
import {PostCreateDto} from "../dto/post.-create.dto";
import {UsersService} from "../users/users.service";
import {PostUpdateDto} from "../dto/post-update.dto";
import {PostUserIdDto} from "../dto/post-user-id.dto";



@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService,
                private readonly usersService: UsersService) {
    }

    createEntity(obj:PostCreateDto) {
        const newEntity=new PostEntity();
        newEntity.title=obj.title;
        newEntity.description=obj.description;
        return newEntity;
    }

    @Get('get-all')
    getAllPosts() {
        return this.postsService.getPosts();
    }

    @Get('get-all-render')
     @Render('post-list')
    getAllPostsRender() {
        return this.postsService.getPosts()
             .then((result) => result ? {posts: result} : {posts: []})
    }
    @Get('get-by-user')
    async getPostsByUser(@Query() query:ParamIdDto):Promise<PostEntity[]> {
        return await this.postsService.getPostsByUser(query.id);
    }

    @Get('get-one')
    async getPost(
        @Query() query: ParamIdDto,
    ): Promise<PostEntity> {
        return this.postsService.getPost(query.id);
    }


    @Post('create')
    async createPost(@Body() data: PostCreateDto): Promise<PostEntity> {
        const _user = await this.usersService.findById(data.userId);
        if (!_user) {
            throw new HttpException(
                'Не существует такого автора', HttpStatus.BAD_REQUEST,
            );
        }
        const newEntity = this.createEntity(data);
        newEntity.user = _user;
        await this.postsService.createPost(newEntity);

        return newEntity;
    }

    @Delete('delete')
    async deletePost(
        @Query() query: ParamIdDto,
    ): Promise<PostEntity[]> {
        const _post = await this.postsService.getPost(query.id);
        if (!_post) {
            throw new HttpException(
                'Не существует такого поста', HttpStatus.BAD_REQUEST,
            );
        }
        return await this.postsService.deletePost(query.id);
    }

    @Put('update')
    async updatePost(@Query()query:ParamIdDto,
        @Body() data: PostUpdateDto): Promise<PostEntity>
    {
        const _post = await this.postsService.getPost(query.id);
        const _user = await this.usersService.findById(data.userId);

        if (!_post) {
            throw new HttpException(
                'Не существует такого поста', HttpStatus.BAD_REQUEST,
            );
        }

        if (!_user) {
            throw new HttpException(
                'Вы пытаетесь изменить пост несуществующего автора', HttpStatus.BAD_REQUEST,
            );
        }

         return await this.postsService.updatePost(query.id,data);
    }

    @Get('/:id/detail')
    @Render('post-item')
    getPostDetails(@Param() params: ParamIdDto) {
        return this.postsService.getPost(params.id)
            .then((data) => data ? {result: data} : {result: null})
    }


    @Get('/detail')
    @Render('post-item-wss')
    getPostDetailWss(@Query() query: PostUserIdDto) {
        return this.postsService.getPost(query.postId)
            .then((data) => data ? {result: data} : {result: null})
    }

    @Get('file')
    getFile(@Res() res: Response) {
        const file = createReadStream(join(process.cwd(), '/media/pexels.jpg'));
        file.pipe(res);
    }
}
