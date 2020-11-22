import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransferDto {
  @IsNotEmpty()
  @IsEmail()
  readonly from: string;

  @IsNotEmpty()
  @IsEmail()
  readonly to: string;

  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;

  @IsNotEmpty()
  @IsString()
  readonly cardNumber: string;

  @IsNotEmpty()
  @IsString()
  readonly cardName: string;

  @IsNotEmpty()
  @IsString()
  readonly cardExpiry: string;

  @IsNotEmpty()
  @IsString()
  readonly cardCvc: string;
}
