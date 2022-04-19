import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SessionEntity} from "../database/entities/session.entity";
import {UserEntity} from "../database/entities/user.entity";
import {RoleEntity} from "../database/entities/role.entity";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {JWT_MODULE_OPTIONS} from "@nestjs/jwt/dist/jwt.constants";

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity, UserEntity, RoleEntity]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY||'SECRET', signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports:[AuthService,JwtModule]
})
export class AuthModule {}
