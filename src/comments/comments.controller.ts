import {
    Body,
    Controller,
    Delete,
    Get, HttpException, HttpStatus,
    Post,
    Put,
    Query, Render, Req,
    UploadedFile, UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {DecrementBodyId} from '../utils/decrement-body-id.decorator';
import {DecrementQueryId} from '../utils/decrement-query-id.decorator';
import {CommentCreateDto} from '../dto/comment-create.dto';
import {PostCreateDto} from '../dto/post.-create.dto';
import {CommentsService} from './comments.service';
import {PostCommentIdDto} from '../dto/post-comment-id.dto';
import {ParamIdDto} from '../dto/param-id.dto';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {extname} from 'path';
import {FileName, FileFilter} from '../utils/upload-img.utils';
import {Express} from 'express';
import {CommentEntity} from "../database/entities/comment.entity";
import {PostEntity} from "../database/entities/post.entity";
import {UsersService} from "../users/users.service";
import {PostsService} from "../posts/posts.service";
import {AuthGuard} from "../auth/auth-guard";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles-guard";

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService,
                private readonly usersService: UsersService,
                private readonly postsService: PostsService,) {}

    createEntity(obj:CommentCreateDto) {
        const newEntity=new CommentEntity();
        newEntity.text=obj.text;
        if(obj.avatar){
        newEntity.avatar=obj.avatar;
        }else{
            newEntity.avatar='';
        }
        return newEntity;
    }

    @Get('/')
     @Render('show-comments')
   async getComments()
    {
        return await this.commentsService.getComments()
             .then((data)=>data? {result:data}:{result:[]})
    }

    @Get('/get-by-post')
     @Render('show-comments')
    async getCommentsByPost(@Query()query: ParamIdDto)
    {
        const _post = await this.postsService.getPost(query.id);
        if (!_post) {
            throw new HttpException(
                'Не существует такого поста', HttpStatus.BAD_REQUEST,
            );
        }

        return this.commentsService.getCommentsByPost(query.id)
             .then((data)=>data? {result:data}:{result:[]})

    }

    @Get('/get-one')
    async getComment(@Query() query: PostCommentIdDto,): Promise<CommentEntity[]> {
        const _post = await this.postsService.getPost(query.postId);
        const _comment = await this.commentsService.getCommentById(query.commentId);
        if (!_post) {
            throw new HttpException(
                'Не существует такого поста', HttpStatus.BAD_REQUEST,
            );
        }
        if (!_comment) {
            throw new HttpException(
                'Не существует комментария', HttpStatus.BAD_REQUEST,
            );
        }
        return this.commentsService.getComment(query.postId, query.commentId);
    }

    @Post('create')
    async createComment(@Body() data: CommentCreateDto): Promise<CommentEntity> {
        const _user = await this.usersService.findById(data.userId);
        const _post = await this.postsService.getPost(data.postId);
        if (!_user) {
            throw new HttpException(
                'Не существует такого автора', HttpStatus.BAD_REQUEST,
            );
        }
        if (!_post) {
            throw new HttpException(
                'Не существует такого поста', HttpStatus.BAD_REQUEST,
            );
        }
        const newEntity = this.createEntity(data);
        newEntity.user = _user;
        newEntity.post= _post;
      return await this.commentsService.createComment(newEntity);
    }
    @UseGuards(AuthGuard)
    @Delete('delete')
    async deleteComment(@Req()request,
        @Query() query: ParamIdDto): Promise<CommentEntity[]> {
        const _user = await this.usersService.findById(query.id);
        if (request.user.email !== _user.email||!request.user.roles.includes('admin')) {
            throw new HttpException("Нет доступа", HttpStatus.FORBIDDEN);
        }
        return this.commentsService.deleteComment(query.id);
    }

    @Put('update')
    async updateComment(
        @Query() query: ParamIdDto,
        @Body() data: CommentCreateDto,
    ): Promise<CommentEntity> {
        const _user = await this.usersService.findById(data.userId);
        const _post = await this.postsService.getPost(data.postId);
        const _comment = await this.commentsService.getCommentById(query.id);
        if (!_comment) {
            throw new HttpException(
                'Не существует такого комментария', HttpStatus.BAD_REQUEST,
            );
        }
        if (!_user) {
            throw new HttpException(
                'Не существует такого автора', HttpStatus.BAD_REQUEST,
            );
        }
        if (!_post) {
            throw new HttpException(
                'Не существует такого поста', HttpStatus.BAD_REQUEST,
            );
        }
        return this.commentsService.updateComment(query.id,data);
    }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './public/uploads',
                filename: FileName,
            }),
            fileFilter: FileFilter,
        }),
    )
    async upload(
         @UploadedFile() file: Express.Multer.File,
         @Body() body: CommentCreateDto,
    ) {
        const _user = await this.usersService.findById(body.userId);
        const _post = await this.postsService.getPost(body.postId);
        if (!_user) {
            throw new HttpException(
                'Не существует такого автора', HttpStatus.BAD_REQUEST,
            );
        }
        if (!_post) {
            throw new HttpException(
                'Не существует такого поста', HttpStatus.BAD_REQUEST,
            );
        }
        const newEntity = this.createEntity(body);
        newEntity.user = _user;
        newEntity.post= _post;
        newEntity.avatar=file.filename;
        return await this.commentsService.createComment(newEntity);

    }

    @Get('create-comment')
    @Render('create-comment')
   async createCommentRender(@Query()query: ParamIdDto) {
        const _post = await this.postsService.getPost(query.id);
        if (!_post) {
            throw new HttpException(
                'Не существует такого поста', HttpStatus.BAD_REQUEST,
            );
        }
        return {
            showId: query.id
        };
    }
}
