import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * the LoginUserDto class that the application uses to verify the user’s credentials when they are trying to login
 */
export class VkLoginUserDto {
  @IsNotEmpty()
  @IsNumber()
  readonly uid: number; // VK user id

  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsString()
  readonly hash: string;
}
