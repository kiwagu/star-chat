import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * The UserDto is used when you want to return the User information
 */
export class UserDto {
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @IsNumber()
  readonly uid?: number;

  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsString()
  readonly firstName?: string;

  @IsString()
  readonly lastName?: string;

  @IsEmail()
  readonly email?: string;

  @IsString()
  readonly cardNumber?: string;

  @IsString()
  readonly cardName?: string;

  @IsString()
  readonly cardExpiry?: string;

  @IsString()
  readonly cardCvc?: string;
}
