import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * The UserDto is used when you want to return the User information
 */
export class UserDto {
  @IsNotEmpty() id: string;
  @IsNotEmpty() username: string;
  @IsNotEmpty() @IsEmail() email: string;
}
