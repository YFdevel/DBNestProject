import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import {MailModule} from "../mail/mail.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../database/entities/post.entity';
import {UsersModule} from "../users/users.module";
import {APP_GUARD} from "@nestjs/core";



@Module({
  imports:[MailModule,TypeOrmModule.forFeature([PostEntity]),UsersModule,],
  controllers: [PostsController],
  providers: [Array,PostsService,],
  exports:[PostsService]
})
export class PostsModule {}
