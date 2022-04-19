import {
    SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets';
import * as cookie from 'cookie';
import {Logger} from '@nestjs/common';
import {Socket, Server} from 'socket.io';
import {PostsService} from "../posts/posts.service";
import {UsersService} from "../users/users.service";
import {CommentsService} from "./comments.service";
import {CommentCreateDto} from "../dto/comment-create.dto";
import {CommentEntity} from "../database/entities/comment.entity";


export type Comment = {
    text: string;
    userId: number;
    postId:number;
    avatar?:string;
};
export type Message = {
    text: string;
    userId: number;
};

@WebSocketGateway()
export class SocketCommentsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly postsService: PostsService,
                private readonly usersService: UsersService,
                private readonly commentsService: CommentsService) {
    }

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('SocketCommentsGateway');

    // @SubscribeMessage('addComment')
    // async handleMessage2(client: Socket, comment: Comment) {
    //
    //     const cookies = cookie.parse(client.handshake.headers.cookie);
    //
    //     const {idNews} = cookies;
    //
    //     client.join(idNews);
    //
    //     this.server.to(idNews).emit('newComment', comment);
    // }

    @SubscribeMessage('msgToServer')
 async handleMessage(client: Socket, payload:Message) {
         const userName=await this.usersService.findById(payload.userId);
       const newPayload={
           text:payload.text,
           name:userName.firstName
         }
        this.server.emit('msgToClient', newPayload);
    }

    @SubscribeMessage('commentToServer')
    async handleComment(client: Socket, payload:Comment) {
        const _user=await this.usersService.findById(payload.userId);
        const _post=await this.postsService.getPost(payload.postId);

        const newEntity = new CommentEntity();
        newEntity.text = payload.text;
        newEntity.avatar = payload?.avatar;
        newEntity.user = _user;
        newEntity.post= _post;

        await this.commentsService.createComment(newEntity);

        const newPayload={
            comment:payload.text,
            name:_user.firstName
        }
        this.server.emit('commentToClient', newPayload);
    }

    @SubscribeMessage('postIdToServer')
    async handlePostId(client: Socket, payload:number) {
        const comments=await this.commentsService.getCommentsByPost(payload);
        this.server.emit('initialComments',comments);
    }

   async afterInit(server: Server) {
        this.logger.log('Init');
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected:${client.id}`);

    }
}
