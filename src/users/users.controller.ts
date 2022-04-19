import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Put,
    Query,
    Render,
    Req,
    UseGuards
} from '@nestjs/common';
import {UsersService} from "./users.service";
import {UserEntity} from "../database/entities/user.entity";
import {ParamIdDto} from "../dto/param-id.dto";
import {UserCreateDto} from "../dto/user-create.dto";
import {AuthGuard} from "../auth/auth-guard";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles-guard";
import {AuthUserDto} from "../dto/auth-user.dto";


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Post('create')
    async createUser(@Body() data: UserCreateDto): Promise<UserEntity> {
        return this.usersService.createUser(data);
    }

    @Get('login')
    @Render('user-login')
    async loginUser() {
    }

    @UseGuards(AuthGuard)
    @Get('get-all')
    async getUsers(@Req()request): Promise<UserEntity[]> {
        console.log(request)
        return this.usersService.getUsers();
    }
    @UseGuards(AuthGuard)
    @Get('get-one')
    async getUser(@Req() request, @Query() query: ParamIdDto): Promise<UserEntity> {
        return await this.usersService.findById(query.id);
    }

    @Get('get-one-render')
    @Render('user-update')
    getUserRender(@Query() query: ParamIdDto) {
        return this.usersService.findById(query.id)
            .then((data) => data ? {result: data} : {result: null})
    }

    @UseGuards(AuthGuard)
    @Put('update')
    async updateUser(@Req() request, @Query() query: ParamIdDto, @Body() data: UserCreateDto): Promise<UserEntity> {
        const _user = await this.usersService.findById(query.id);
        if (request.user.email !== _user.email) {
            throw new HttpException("Нет доступа", HttpStatus.FORBIDDEN);
        }
        return this.usersService.updateUser(query.id, data);
    }

    @Roles('admin')
    @UseGuards(RolesGuard)
    @Delete('delete')
    async deleteUser(@Query() query: ParamIdDto,
    ): Promise<UserEntity[]> {
        return this.usersService.deleteUser(query.id);
    }
}
