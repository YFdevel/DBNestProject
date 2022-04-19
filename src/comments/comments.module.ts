import {Module} from '@nestjs/common';
import {CommentsController} from './comments.controller';
import {CommentsService} from './comments.service';
import {PostsController} from '../posts/posts.controller';
import {PostsModule} from '../posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '../database/entities/comment.entity';
import {UsersModule} from "../users/users.module";
import { SocketCommentsGateway } from './socket-comments.gateway';



@Module({
    imports: [
        PostsModule, UsersModule, TypeOrmModule.forFeature([CommentEntity],),
    ],
    controllers: [PostsController],
    providers: [Array, CommentsService, SocketCommentsGateway
    ],
    exports: [CommentsService]
})
export class CommentsModule {
}
