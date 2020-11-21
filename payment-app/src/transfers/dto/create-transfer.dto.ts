import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

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
}
