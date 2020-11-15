import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * The UserDto is used when you want to return the User information
 */
export class UserDto {
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @IsString()
  readonly uid?: number;

  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly firstName?: string;

  @IsString()
  readonly lastName?: string;
}
