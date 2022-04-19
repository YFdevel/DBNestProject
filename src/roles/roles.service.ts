import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {RoleEntity} from "../database/entities/role.entity";
import {Repository} from "typeorm";
import {plainToClass} from "class-transformer";
import {CreateRoleDto} from "../dto/create-role.dto";

@Injectable()
export class RolesService {
    constructor(@InjectRepository(RoleEntity) private readonly rolesRepository: Repository<RoleEntity>,) { }

    async create(params: CreateRoleDto) {
        const { value, description } = params;
        const isValue = await this.rolesRepository.findOne({ value: value });
        if (isValue) {
            throw new HttpException('The role with this value is already exist', HttpStatus.CONFLICT);
        }
        const result = await this.rolesRepository.save({ value: value, description: description });
        return plainToClass(CreateRoleDto, result);
    }

    async deleteByValue(value: string) {
        const role = await this.rolesRepository.findOne({value:value});
        if (!role) {
            throw new HttpException('Role does not exist', HttpStatus.NOT_FOUND);
        }
        await this.rolesRepository.remove(role);
    }


    async getByValue(value: string) {
        const role = await this.rolesRepository.findOne({value:value});
        if (!role) {
            throw new HttpException('Role does not exist', HttpStatus.NOT_FOUND);
        }
        return role;
    }


}
