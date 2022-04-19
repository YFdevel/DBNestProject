import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty, IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { CommentCreateDto } from './comment-create.dto';

export class PostCreateDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsOptional()
  createdAt: Date;

  @IsDateString()
  @IsOptional()
  updatedAt: Date;

  @IsNotEmpty()
  @IsInt()
  userId:number;

  @IsOptional()
  @IsArray()
  comments: CommentCreateDto[];
}
