import { IsNotEmpty, IsString } from 'class-validator';

/**
 * the LoginUserDto class that the application uses to verify the user’s credentials when they are trying to login
 */
export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
