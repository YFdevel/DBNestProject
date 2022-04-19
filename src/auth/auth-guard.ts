import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {SessionEntity} from "../database/entities/session.entity";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectRepository(SessionEntity)
        private readonly sessionsRepository: Repository<SessionEntity>,
        private jwtService: JwtService
    ) {
    }

    async canActivate(ctx: ExecutionContext) {
        const request = ctx.switchToHttp().getRequest();
        try {
            let accessToken = request.headers['authorization'];
            if(!accessToken){
               accessToken=request.body['tokenForm'];
            }
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

            return true;
        } catch (e) {
            throw new UnauthorizedException({message: "Пользователь не авторизован"});
        }

    }
}
