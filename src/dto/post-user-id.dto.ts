import {IsNotEmpty, IsNumberString} from 'class-validator';

export class PostUserIdDto {
    @IsNumberString()
    @IsNotEmpty()
    postId: number;

    @IsNumberString()
    @IsNotEmpty()
    userId: number;
}
