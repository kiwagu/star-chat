import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TransfersService } from './transfers/transfers.service';

@Injectable()
export class AppService {
  constructor(private readonly transfersService: TransfersService) {}
  loadForm(paymentSessionKey: string) {
    const isPaymentSessionKeyPresent = this.transfersService.getStatus(
      paymentSessionKey,
    );
    if (!isPaymentSessionKeyPresent) {
      throw new HttpException(
        'paymentSessionKey is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      paymentSessionKey,
      checkSum: this.transfersService.calcChecksum(paymentSessionKey),
    };
  }
}
