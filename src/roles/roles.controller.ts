import {Body, Controller, Delete, Get, Post} from '@nestjs/common';
import {CreateRoleDto} from "../dto/create-role.dto";
import {DeleteRoleDto} from "../dto/delete-role.dto";
import {RolesService} from "./roles.service";

@Controller('roles')
export class RolesController {

    constructor(private readonly rolesService: RolesService) {}

    @Post('create')
    create(@Body() params: CreateRoleDto) {
        return this.rolesService.create(params);
    }

    @Delete('delete')
    delete(@Body()  {value} : DeleteRoleDto) {
        return this.rolesService.deleteByValue(value);
    }

    @Get('get')
    get(@Body() { value }: DeleteRoleDto) {
        return this.rolesService.getByValue(value);
    }
}
