import {IsNotEmpty, IsNumberString} from 'class-validator';
export class ParamIdDto {
  @IsNumberString()
  @IsNotEmpty()
  id!: number;
}
