import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * The CreateUserDto class is used to pass the information provided by the user upon registering a new account.
 */
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
