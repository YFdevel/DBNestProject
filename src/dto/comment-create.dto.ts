import {
  IsArray,
  IsDate, IsDateString,
  IsInt, IsNotEmpty, IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';
import {UserEntity} from "../database/entities/user.entity";
import {UserCreateDto} from "./user-create.dto";

export class CommentCreateDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsDateString()
  createdAt: Date;

  @IsOptional()
  @IsString()
  avatar:string;

  @IsNotEmpty()
  @IsNumberString()
  userId:number;

  @IsNotEmpty()
  @IsNumberString()
  postId:number;
}
