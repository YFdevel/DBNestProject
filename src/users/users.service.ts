import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserEntity} from "../database/entities/user.entity";
import {MailService} from "../mail/mail.service";
import {UserCreateDto} from "../dto/user-create.dto";
import {hash} from '../utils/crypto';
import {RolesService} from "../roles/roles.service";


@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity)
                private readonly usersRepository: Repository<UserEntity>,
                private readonly mailService: MailService,
                private readonly rolesService: RolesService) {
    }

    async createUser(data: UserCreateDto): Promise<UserEntity> {
        data.password = await hash(data.password);
        const role = await this.rolesService.getByValue("user");
        let newUser = new UserEntity();
        newUser = {...newUser, ...data, roles: [role]};

        return await this.usersRepository.save(newUser);
    }

    async getUsers(): Promise<UserEntity[]> {
        return await this.usersRepository.find(
            {
                relations: ['posts', 'comments', 'roles', 'sessions'],
                join: {
                    alias: "user",
                    leftJoinAndSelect: {
                        posts: "user.posts",
                        comments: "user.comments",
                        roles: "user.roles",
                        sessions: "user.sessions",
                    }
                }
            });

    }

    async findById(id: number): Promise<UserEntity | undefined> {
        return this.usersRepository.findOne({
            where: {
                id,
            },
            relations: ['posts', 'comments', 'roles', 'sessions'],
            join: {
                alias: "user",
                leftJoinAndSelect: {
                    posts: "user.posts",
                    comments: "user.comments",
                    roles: "user.roles",
                    sessions: "user.sessions",
                }
            }
        });
    }

    async findByEmail(email): Promise<UserEntity> {
        return this.usersRepository.findOne({email});
    }

    async updateUser(id: number, data: UserCreateDto): Promise<UserEntity> {
        let existingData = await this.usersRepository.findOne({
            where: {
                id,
            },
        });
        let prevData = existingData;
        data.password = await hash(data.password);
        const nextData = await this.usersRepository.save({
            ...existingData,
            ...data,
        });

        return nextData;
    }

    async deleteUser(id: number): Promise<UserEntity[]> {
        const user = await this.usersRepository.findOne({
            where: {
                id,
            },
        });
        if (user) {
            await this.usersRepository.remove(user);
            return await this.usersRepository.find();
        } else throw new Error('Post not found');
    }


}


