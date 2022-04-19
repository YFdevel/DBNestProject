import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {MailModule} from "../mail/mail.module";
import {RoleEntity} from "../database/entities/role.entity";
import {UsersRoles} from "../database/entities/users_roles.entity";
import {RolesModule} from "../roles/roles.module";
import {SessionEntity} from "../database/entities/session.entity";
import {AuthModule} from "../auth/auth.module";


@Module({
  imports:[TypeOrmModule.forFeature([UserEntity,RoleEntity,UsersRoles,SessionEntity]),MailModule,RolesModule,AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule {}



