import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {AuthUserDto} from "../dto/auth-user.dto";
import {SessionEntity} from "../database/entities/session.entity";
import {RegisterUserDto} from "../dto/register-user.dto";
import {plainToClass} from "class-transformer";
import {UserCreateDto} from "../dto/user-create.dto";
import * as bcrypt from 'bcrypt';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../database/entities/user.entity";
import {Repository} from "typeorm";
import {RoleEntity} from "../database/entities/role.entity";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
        @InjectRepository(SessionEntity)
        private readonly sessionsRepository: Repository<SessionEntity>,
        @InjectRepository(RoleEntity)
        private readonly rolesRepository: Repository<RoleEntity>,
        private jwtService: JwtService
    ) {
    }

    async login({email, password}: AuthUserDto) {
        const user = await this.usersRepository.findOne({email: email});
        if (!user) {
            throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        }
        const {password: userPassword} = user;
        const isCorrectPassword = await this.comparePasswords(userPassword, password);
        if (!isCorrectPassword) {
            throw new HttpException('The password is invalid', HttpStatus.UNAUTHORIZED);
        }
        const accessToken=await this.generateToken(user);
        const session = new SessionEntity();
          session.token = `Bearer ${accessToken}`;
        session.user = user;
        await this.sessionsRepository.save(session);
         return { accessToken };
    }

    async register(params: RegisterUserDto) {
        const {email, password} = params;
        const saltRounds = 10
        const isLogin = await this.usersRepository.findOne({email: email});
        if (isLogin) {
            throw new HttpException('The user with this email is already registered', HttpStatus.CONFLICT);
        }
        const role = await this.rolesRepository.findOne({value: "user"})
        const passwordHash = await this.getHashPassword(password, saltRounds);
        const newUser = {
            ...params,
            password: passwordHash,
            roles: [role],
        };
        const result = await this.usersRepository.save(newUser);
        return plainToClass(UserCreateDto, result);
    }

    comparePasswords(userPassword: string, password: string): Promise<boolean> {
        return bcrypt.compare(password, userPassword);
    }

    async getHashPassword(password: string, saltRounds: number): Promise<string> {
        return bcrypt.hash(password, saltRounds);
    }


    async generateToken(user: UserEntity) {
        const payload = {
            email: user.email, id: user.id
        }
        return this.jwtService.sign(payload)

    }

}
