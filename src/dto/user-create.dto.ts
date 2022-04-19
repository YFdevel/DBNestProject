import {IsNotEmpty, IsString, IsEmail, IsInt, IsOptional, IsArray, IsEnum} from 'class-validator';
export class UserCreateDto {
    @IsInt()
    @IsOptional()
    id:number;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;


    @IsString()
    @IsOptional()
    tokenForm: string;

}
