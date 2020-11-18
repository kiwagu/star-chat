import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * the VkLoginUserDto class that the application uses to verify the user’s credentials when they are trying to login by BK
 */
export class VkLoginUserDto {
  @IsNotEmpty()
  @IsNumber()
  readonly uid: number;

  @IsNotEmpty()
  @IsString()
  readonly hash: string;

  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;
}
