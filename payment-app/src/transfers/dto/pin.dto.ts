import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PinDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  readonly paymentSessionKey: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(6)
  readonly pin: string;
}
