import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import { CreateTransferDto } from './dto/create-transfer.dto';
import { PaymentStatus, Transfer } from './entities/transfer.entity';

@Injectable()
export class TransfersService {
  private transfers: Transfer[] = [];

  create(createTransferDto: CreateTransferDto) {
    const paymentSessionKey = crypto.randomBytes(20).toString('hex');
    this.transfers.push({
      paymentSessionKey,
      status: 'pending',
      ...createTransferDto,
    });

    return { paymentSessionKey };
  }

  calcChecksum(sessionKey: string) {
    const checkSum = sessionKey.replace(/[a-z]+/g, '');
    return checkSum;
  }

  setStatus(paymentSessionKey: string, status: PaymentStatus) {
    this.transfers.forEach((transfer) => {
      if (transfer.paymentSessionKey === paymentSessionKey) {
        transfer.status = status;
      }
    });
  }

  getStatus(paymentSessionKey: string) {
    return this.transfers.find(
      (transfer) =>
        transfer.paymentSessionKey === paymentSessionKey && transfer.status,
    );
  }
}
