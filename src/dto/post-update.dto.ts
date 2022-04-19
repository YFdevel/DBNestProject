import {
    IsArray,
    IsDateString,
    IsInt,
    IsNotEmpty, IsOptional,
    IsPositive,
    IsString,
} from 'class-validator';
import { CommentCreateDto } from './comment-create.dto';

export class PostUpdateDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @IsInt()
    userId:number;

}
