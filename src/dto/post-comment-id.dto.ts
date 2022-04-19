import {IsNotEmpty, IsNumberString} from 'class-validator';
export class PostCommentIdDto {
  @IsNumberString()
  @IsNotEmpty()
  postId: number;

  @IsNumberString()
  @IsNotEmpty()
  commentId: number;
}
