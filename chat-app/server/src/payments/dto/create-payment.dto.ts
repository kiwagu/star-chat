import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  readonly amount: string;

  @IsNotEmpty()
  @IsUUID()
  readonly toUserId: string;
}
