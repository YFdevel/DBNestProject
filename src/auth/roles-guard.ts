import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
    Inject,
    NotFoundException,
} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UsersRoles} from "../database/entities/users_roles.entity";
import {Reflector} from "@nestjs/core";
import {RoleEntity} from "../database/entities/role.entity";
import {Repository} from "typeorm";
import {UserEntity} from "../database/entities/user.entity";
import {SessionEntity} from "../database/entities/session.entity";
import {JwtService} from "@nestjs/jwt";
import {ROLES_KEY} from "./roles-auth.decorator";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        @InjectRepository(SessionEntity)
        private readonly sessionsRepository: Repository<SessionEntity>,
        private jwtService: JwtService,
        private reflector:Reflector
    ) {}

    async canActivate(ctx: ExecutionContext) {
        const request = ctx.switchToHttp().getRequest();
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                ctx.getHandler(),
                ctx.getClass(),
            ]);
            if (!requiredRoles) {
                return true;
            }
            const accessToken = request.headers['authorization'];
            const token = accessToken.split(' ')[1];

            if (!accessToken) {
                throw new UnauthorizedException("Пользователь не авторизован");
            }
            const session = await this.sessionsRepository.findOne({token: accessToken});
            if (!session) {
                throw new UnauthorizedException({message: "Пользователь не авторизован"});
            }
            const user = this.jwtService.verify(token);
            request.user = user;

            return user.roles.some(role=>requiredRoles.includes(role.value));
        } catch (e) {
            throw new HttpException("Нет доступа",HttpStatus.FORBIDDEN);
        }

    }
}
