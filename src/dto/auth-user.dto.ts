import { IsString, IsNotEmpty } from 'class-validator';

export class AuthUserDto {
	@IsNotEmpty()
	@IsString()
	email: string;

	@IsNotEmpty()
	@IsString()
	password: string;
}
