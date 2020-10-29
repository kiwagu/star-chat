import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * The UserDto is used when you want to return the User information
 */
export class UserDto {
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
