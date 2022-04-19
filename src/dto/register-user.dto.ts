import {IsString, IsNotEmpty, IsPhoneNumber, IsEmail} from 'class-validator';

export class RegisterUserDto {

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

}
