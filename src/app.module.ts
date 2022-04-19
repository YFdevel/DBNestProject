import {HttpModule, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from './mail/mail.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import {MailController} from "./mail/mail.controller";
import {PostsController} from "./posts/posts.controller";
import {CommentsController} from "./comments/comments.controller";
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./database/entities/user.entity";
import {RoleEntity} from "./database/entities/role.entity";
import {UsersRoles} from "./database/entities/users_roles.entity";
import {SessionEntity} from "./database/entities/session.entity";



@Module({
  imports: [PostsModule, CommentsModule, MailModule,ConfigModule.forRoot({
    envFilePath:'.env'
  }),
    ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..','public'),
  }), UsersModule,DatabaseModule, RolesModule, AuthModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('vendors.apiEndpoint'),
        headers: {
          'Authorization': 'Basic ' + configService.get('vendors.encodeToken')
        },
        timeout: 7000,
        maxRedirects: 5
      }),
      inject: [ConfigService]
    }),TypeOrmModule.forFeature([UserEntity,RoleEntity,UsersRoles,SessionEntity])],
  controllers: [AppController,PostsController, CommentsController,MailController],
  providers: [AppService,
  ],
})
export class AppModule {}
